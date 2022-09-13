/*About "ctg4.js"


Functions in the "ctg4.js":
1. _passParam: When a specific catalog in navigation bar is clicked or a keyword is entered, pass the related parameters through url and open "index.html".
2. setCurrentPage: Set the navigation bar layout based on the chosed catalog.
3. input_show: The "#search_img" function in the mobile layout.
4. _goTop: To display "#gotop" or not based on the scroll distance of page.
5. _aboutme: When "關於作者" is clicked, information about author is shown.


When _startFunction.init() is conducted:
1. Each <a> in the navigation bar is added the "onclick" listener. When clicked, "_passParam" function is conducted.
2. Set the navigation bar layout of catalog 4.
3. Add "onkeydown" listener on "#search_keyword". When "enter" is pressed, "_passParam" function is executed.
4. For "#search_img", different function is added related to screen width:
	Mobile layout: "input_show" function is added.
	Non-mobile layout: "_passParam: will be executed when clicked.
5. "window.onscroll" event is listened to determine whether the "#gotop" appears or not.


Code name of catalogs:
1: 全部類別
2: 資料結構與演算法
3: 程式設計
4: 資料庫
5: 通訊與網路
6: 資訊安全
7: 計算機概論
8: 關於作者

*/

(function(document) {
	var _startFunction =(function() {
		
		//Pass parameters of "keyword" and "catalog" to index.html then open it.
		_passParam = function(keyword, ctg) {
			location.assign('../index.html?keyword='+keyword+'&ctg='+ctg);
		}
		
		
		//Set layout of navigation bar based on the chosed catalog.
		_setCurrentPage = function(ctg) {
			
			
			//For non-PC layout
			var ctgName=$('.catalog_select a').eq(ctg-1).text();
			$('.catalog_select span').html('<img src="../pics/catalog_select_arrow.png" alt="arrow">'+ctgName);
			
			//For PC layout
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
		
		//Function of "#search_img" in mobile layout. When clicked, the "#search_keyword" show.
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
		
		
		//When scrolling the page over specific distance, the "#gotop" show.
		_goTop = function() {
			var gotop = document.getElementById('gotop'); 
			
			var length = document.documentElement.scrollTop;
			
			if(length <= 30) {
				gotop.classList.remove('appear');
			} else {
				gotop.classList.add('appear');
			}
			
		}
		
		//Function of displaying ".aboutme".
		_aboutme = function() {
			$('.main').css('display','none');
			_setCurrentPage(8);
			var aboutme = $('.aboutme');
			aboutme.addClass('aboutme_show');
		}
		
		
		return {
			init() {

				//Add "onclick" listener on each <li> in navigation bar.
				$('div[class^="catalog_select"]  li[class="ctg_1"] a').attr('onclick','_passParam("",1)');
				$('div[class^="catalog_select"]  li[class="ctg_2"] a').attr('onclick','_passParam("",2)');
				$('div[class^="catalog_select"]  li[class="ctg_3"] a').attr('onclick','_passParam("",3)');
				$('div[class^="catalog_select"]  li[class="ctg_4"] a').attr('onclick','_passParam("",4)');
				$('div[class^="catalog_select"]  li[class="ctg_5"] a').attr('onclick','_passParam("",5)');
				$('div[class^="catalog_select"]  li[class="ctg_6"] a').attr('onclick','_passParam("",6)');
				$('div[class^="catalog_select"]  li[class="ctg_7"] a').attr('onclick','_passParam("",7)');
				$('div[class^="catalog_select"]  li[class="ctg_8"] a').attr('onclick','_aboutme()');
				
				
				//Set the style of current page.
				_setCurrentPage(4);	
				
				
				//Add "onkeydown" listener on "#search_keyword"
				$('#search_keyword').keydown(function(event) {
					if(event.which === 13) {
						var keyword = $('#search_keyword').val();
						_passParam(keyword,1);
						
						//Remove attribute "data-show" of "#search_keyword" for mobile layout.
						$('#search_keyword').removeAttr('data-show');
					};
				
				});
				
				
				//For "#search_img", different function is added according to the screen width.
				
				//When page is loaded.
				//For non-mobile layout.
				if(window.innerWidth > 480) {
					$('#search_keyword').removeAttr('data-show');
					$('#search_img').off('click').on('click',function() {
						var keyword = $('#search_keyword').val();
						_passParam(keyword,1);
					});
				}
				
				//For mobile layout.
				if(window.innerWidth <= 480) {
					$('#search_img').on('click',input_show);
				}
				
				
				//When screen width is changed.
				window.addEventListener('resize',function() {
					
					//For non-mobile layout.
					if(window.innerWidth > 480) {
						$('#search_keyword').removeAttr('data-show');
						$('#search_img').off('click').on('click',function() {
							var keyword = $('#search_keyword').val();
							_passParam(keyword,1);
						});
					}
					
					//For mobile layout.
					if(window.innerWidth <= 480) {
						$('#search_img').on('click',input_show);
					}
				});
				
				
				//When scrolling page, trigger "_goTop" function. 
				window.onscroll = _goTop;
	
			}
		};
	})();
	
	document.addEventListener('readystatechange', function() {
		if(document.readyState === 'complete') {
			_startFunction.init();
		}
	});
})(document);
