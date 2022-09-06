(function(document) {
	//alert(1);
	
	var _startFunction =(function(arr) {
		
		const num_per_page=5;
		
		//分頁功能(每5筆資料一頁
		_dividePage = function(cur_page, num_per_page) {
			
			
			//取得需要顯示的tr
			var tr = $('table tbody tr[data-keyword="show"][data-ctg="show"]');
			//alert(tr.length);
			
			//要顯示的起始row index與最後的row index
			var startIndex = (cur_page-1)*num_per_page + 1;
			var endIndex = cur_page*num_per_page;
			
			//決定哪些要顯示
			tr.each(function(index,row) {
				if((index+1) >= startIndex && (index+1) <= endIndex) {
					row.style.display='table-row';
				} else {
					row.style.display='none';
				}
			});
			
			//顯示頁數
			var pageNum = Math.ceil(tr.length/num_per_page);
			
			if(pageNum <= 1) {
				$('#div_page').get(0).style.display='none';
			} else {
				$('#div_page').get(0).style.display='flex';
				var tempHTML="";
				tempHTML+='<button onclick="_dividePage(' + (cur_page-1) + ',' + num_per_page + ')"></button>';
				for(let i=1;i<=pageNum;i++) {
					//插入頁號碼
					tempHTML+='<button onclick="_dividePage(' + i + ',' + num_per_page + ')">' + i + '</button>';
				}
				tempHTML+='<button onclick="_dividePage(' + (cur_page+1) + ',' + num_per_page + ')"></button>';
				$('#div_page').html(tempHTML);
			}
			
			//判斷目前頁數與可否按下
			var btn = $('#div_page button');
			
			if(cur_page == 1) {
				btn.eq(0).attr('disabled','disabled');
			}
			if(cur_page == pageNum) {
				btn.eq(pageNum+1).attr('disabled','disabled');
			}
			btn.eq(cur_page).attr('data-current-page','true');
		}
		
		//篩選功能
		_filter = function(keyword, ctg) {
			
			//先把tale, div_page顯示出來並讓aboutme消失
			$('table').css('display','table');
			$('#div_page').css('display','flex');
			$('.aboutme').removeClass('aboutme_show');
			
			var tr=$('table tbody tr');
			
			tr.each(function(index,row) {

				//篩選關鍵字
				if(row.textContent.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {					
					$(row).attr('data-keyword','no');
				} else {					
					$(row).attr('data-keyword','show');
				}
				
				//篩選類別
				tr.each(function(index,row) {
					var rowClass=row.getAttribute('class');
					const regex=new RegExp(ctg,'ig');
					
					if(ctg == 1 || regex.test(rowClass)) {
						$(row).attr('data-ctg','show');
					} else {
						$(row).attr('data-ctg','no');
					}
				});
				
				
				//決定哪一列需要顯示/隱藏
				tr.each(function(index,row) {
					if($(row).attr('data-keyword') === 'show' && $(row).attr('data-ctg') === 'show') {
						row.style.display='table-row';
					} else {
						row.style.display='none';
					}
				});
				
				

				
			});
			
			//開始分頁；預設顯示第一頁
			_dividePage(1,num_per_page);	
			
			
			//目前類別灰底藍字(for PC), span字換成所選類別(for non-PC)
			//non-PC版
			var ctgName=$('.catalog_select a').eq(ctg-1).text();
			$('.catalog_select span').html('<img src="pics/catalog_select_arrow.png" alt="arrow">'+ctgName);
			
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
			_filter('',8);
			var aboutme = $('.aboutme');
			aboutme.addClass('aboutme_show');
			$('table').css('display','none');
			$('#div_page').css('display','none');
			
		}
		
		
		return {
			init() {
				//每個類別的li加上onclick listener
				//alert('init');
				$('div[class^="catalog_select"]  li[class="ctg_1"] a').attr('onclick','_filter("",1)');
				$('div[class^="catalog_select"]  li[class="ctg_2"] a').attr('onclick','_filter("",2)');
				$('div[class^="catalog_select"]  li[class="ctg_3"] a').attr('onclick','_filter("",3)');
				$('div[class^="catalog_select"]  li[class="ctg_4"] a').attr('onclick','_filter("",4)');
				$('div[class^="catalog_select"]  li[class="ctg_5"] a').attr('onclick','_filter("",5)');
				$('div[class^="catalog_select"]  li[class="ctg_6"] a').attr('onclick','_filter("",6)');
				$('div[class^="catalog_select"]  li[class="ctg_7"] a').attr('onclick','_filter("",7)');
				$('div[class^="catalog_select"]  li[class="ctg_8"] a').attr('onclick','_aboutme()');
				
				//預設顯示全部類別
				//從內容頁返回主頁時，需讀取url中的參數(關鍵字or類別)，然後進行過濾__?！
				
				var param = location.search;
				
				if(param == "") {
					_filter("",1);
				} else {
					const regex_keyword = new RegExp('keyword=([^?&]*)','i');
					const regex_ctg = new RegExp('ctg=([^?&]+)','i');
					let keyword=decodeURI(param.match(regex_keyword)[1]);
					let ctg = param.match(regex_ctg)[1];
					
					_filter(keyword,ctg);
				}
				
				
				//search的input加上onkeydown的listener
				$('#search_keyword').keydown(function(event) {
					if(event.which === 13) {
						var keyword = $('#search_keyword').val();
						_filter(keyword,1);
						
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
						_filter(keyword,1);
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
							_filter(keyword,1);
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
			1. 篩選功能__OK
			2. 分頁顯示功能_OK
			3. 搜尋input欄位開始監聽enter與放大鏡onclick之後的篩選；預設類別「全部類別」__OK
			4. 點選catalog的其中一個之後進行該類別的篩選；目前的類別以灰底藍字顯示；預設類別「全部類別」__OK
			5. 點選list中的h1會連到該文章頁面__OK
			6. 點選list中的h2會以該標題為關鍵字進行篩選；預設類別「全部類別」__OK
			7. 垂直方向遠離頂端之後出現向上的按鈕(固定在視窗右下角)，按一下可以回到最上面__OK
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