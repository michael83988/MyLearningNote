

(function(document) {
	//alert(1);
	
	var _startFunction =(function(arr) {
		
		//在url後加上參數，然後連結index.html
		_passParam = function(keyword, ctg) {
			location.assign('../index.html?keyword='+keyword+'&ctg='+ctg);
		}
		
		
		//設定目前頁面的版面配置
		_setCurrentPage = function(ctg) {
			//
			//目前類別灰底藍字(for PC), span字換成所選類別(for non-PC)
			//non-PC版
			var ctgName=$('.catalog_select a').eq(ctg-1).text();
			$('.catalog_select span').html('<img src="../pics/catalog_select_arrow.png" alt="arrow">'+ctgName);
			
			//PC版
			$('.catalog_select_PC li').each(function(index,li) {
				if(index == ctg-1) {
					$(li).attr('data-current-ctg','true');
					$(li).find('a').attr('data-current-ctg','true');
				} else {
					$(li).attr('data-current-ctg','false');
					$(li).find('a').attr('data-current-ctg','false');
				}
			});
		}
		
		
		//手機板的search放大鏡所使用的功能
		//click時，input出現，且按下放大鏡時開始filter
		input_show = function () {
			$('#search_keyword').attr('data-show','true');
			$('#search_keyword').focus(function() {
				$(this).focusout(function() {
					$(this).removeAttr('data-show');
					$('#search_keyword').off('focus').off('focusout');
					
				});
			});
			$('#search_keyword').trigger('focus');
		}
		
		//監聽視窗捲動事件，若往下捲動超過一定距離則顯示回到最上面的按鈕
		_goTop = function() {
			var gotop = document.getElementById('gotop'); 
			
			var length = document.documentElement.scrollTop;
			
			if(length <= 30) {
				gotop.classList.remove('appear');
			} else {
				gotop.classList.add('appear');
			}
			
		}
		
		//顯示作者資訊
		_aboutme = function() {
			//將主文章(main)給隱藏
			$('.main').css('display','none');
			
			_setCurrentPage(8);
			var aboutme = $('.aboutme');
			
			aboutme.addClass('aboutme_show');
			
		}
		
		
		return {
			init() {
				//每個類別的li加上onclick listener
				
				$('div[class^="catalog_select"]  li[class="ctg_1"] a').attr('onclick','_passParam("",1)');
				$('div[class^="catalog_select"]  li[class="ctg_2"] a').attr('onclick','_passParam("",2)');
				$('div[class^="catalog_select"]  li[class="ctg_3"] a').attr('onclick','_passParam("",3)');
				$('div[class^="catalog_select"]  li[class="ctg_4"] a').attr('onclick','_passParam("",4)');
				$('div[class^="catalog_select"]  li[class="ctg_5"] a').attr('onclick','_passParam("",5)');
				$('div[class^="catalog_select"]  li[class="ctg_6"] a').attr('onclick','_passParam("",6)');
				$('div[class^="catalog_select"]  li[class="ctg_7"] a').attr('onclick','_passParam("",7)');
				$('div[class^="catalog_select"]  li[class="ctg_8"] a').attr('onclick','_aboutme()');
				
				
				//預設顯示當前類別
				_setCurrentPage(3);	
				
				//search的input加上onkeydown的listener
				$('#search_keyword').keydown(function(event) {
					if(event.which === 13) {
						var keyword = $('#search_keyword').val();
						_passParam(keyword,1);
						
						//for手機板
						$('#search_keyword').removeAttr('data-show');
					};
				
				});
				
				
				//針對search的放大鏡，不同螢幕寬度有不同功能
				
				//初始設定
				//非手機板
				if(window.innerWidth > 480) {
					$('#search_keyword').removeAttr('data-show');
					$('#search_img').off('click').on('click',function() {
						var keyword = $('#search_keyword').val();
						_passParam(keyword,1);
					});
				}
				//手機板
				if(window.innerWidth <= 480) {
					$('#search_img').on('click',input_show);
				}
				
				
				//螢幕寬度改變時
				window.addEventListener('resize',function() {
					//非手機板
					if(window.innerWidth > 480) {
						$('#search_keyword').removeAttr('data-show');
						$('#search_img').off('click').on('click',function() {
							var keyword = $('#search_keyword').val();
							_passParam(keyword,1);
						});
					}
					//手機板
					if(window.innerWidth <= 480) {
						$('#search_img').on('click',input_show);
					}
				});
				
				
				//往下捲動視窗時，出現回到最上面的按鈕(圖案)
				window.onscroll = _goTop;
	
			}
		};
	})([]);
	
	document.addEventListener('readystatechange', function() {
		if(document.readyState === 'complete') {
			_startFunction.init();
			
			/*
			// 需要的功能
			1. _passParam傳遞參數至index.html: nav除了關於作者之外、搜尋input欄位按下enter後的內容與放大鏡onclick之後input內的內容(預設類別「全部類別」)__OK
			2. setCurrentPage設定目前的類別(span顯示正確的目前類別、li需要灰底藍字__OK
			3. 點選article中的h2會以該標題為關鍵字進行參數傳遞(到index.html)；預設類別「全部類別」
			4. 垂直方向遠離頂端之後出現向上的按鈕(固定在視窗右下角)，按一下可以回到最上面__OK
			*/
			
			
			/*類別代號(class)：
			ctg_1: 全部
			ctg_2: 資料結構與演算法
			ctg_3: 程式設計
			ctg_4: 資料庫
			ctg_5: 通訊與網路
			ctg_6: 資訊安全
			ctg_7: 計算機概論
			ctg_8: 關於作者 -> 內建在每個html中__OK
			*/
		}
	});
})(document);

//alert('Hello!');