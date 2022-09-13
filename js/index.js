/*About "index.js"


Functions in the "index.js":
1. _dividePage: To display the limited amount (5/page) of filtered results in a single page. It is executed automatically after "_filter" is conducted.
2. _filter: To filter the targeted results according to the entered keyword or the chosed catalog.
3. input_show: The function for "#search_img" in the mobile layout.
4. _goTop: To display "#gotop" or not based on the scroll distance of page.
5. _aboutme: When "關於作者" is clicked, information about author is going to be shown.


When "_startFunction.init()" is conducted:
1. Each <a> in the navigation bar is added the "onclick" listener. When clicked, "_filter" function is conducted.
2. Get the parameter from url then execute "_filter" function.
3. Add "onkeydown" listener on "#search_keyword". When "enter" is pressed, "_filter" function is executed.
4. For "#search_img", different function is added based on the screen width:
	Mobile layout (<= 480 px): "input_show" function is added.
	Non-mobile layout (> 480 px): "_filter" will be executed when clicked.
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
		
		
		const num_per_page=5;
		
		//Divide pages function (5 <tr> per page)
		_dividePage = function(cur_page, num_per_page) {
			
			
			//Get the collection of <tr> elements matching the "_filter" condition.
			var tr = $('table tbody tr[data-keyword="show"][data-ctg="show"]');

			
			//The start and the end indexes of <tr> collection which are going to be displayed in the current page.
			var startIndex = (cur_page-1)*num_per_page + 1;
			var endIndex = cur_page*num_per_page;
			
			//Show <tr> element if it is in the range of "startIndex" and "endIndex", otherwise hide it.
			tr.each(function(index,row) {
				if((index+1) >= startIndex && (index+1) <= endIndex) {
					row.style.display='table-row';
				} else {
					row.style.display='none';
				}
			});
			
			
			//Show page numbers in "#div_page" block.
			var pageNum = Math.ceil(tr.length/num_per_page);
			if(pageNum <= 1) {
				$('#div_page').get(0).style.display='none';
			} else {
				$('#div_page').get(0).style.display='flex';
				var tempHTML="";
				
				//Create "previous page" button.
				tempHTML+='<button onclick="_dividePage(' + (cur_page-1) + ',' + num_per_page + ')"></button>';
				
				//Create buttons with each page number.
				for(let i=1;i<=pageNum;i++) {
					tempHTML+='<button onclick="_dividePage(' + i + ',' + num_per_page + ')">' + i + '</button>';
				}
				
				//Create "next page" button.
				tempHTML+='<button onclick="_dividePage(' + (cur_page+1) + ',' + num_per_page + ')"></button>';
				
				//Insert all the above buttons in "#div_page" block.
				$('#div_page').html(tempHTML);
			}
			
			
			//Determine if the "previous page" and "next page" button could be pressed or not.
			//Also set the button representing current page the "data-current-page='true'" attribute for "index.css".
			var btn = $('#div_page button');
			if(cur_page == 1) {
				btn.eq(0).attr('disabled','disabled');
			}
			if(cur_page == pageNum) {
				btn.eq(pageNum+1).attr('disabled','disabled');
			}
			btn.eq(cur_page).attr('data-current-page','true');
		}
		
		
		
		//Filter function
		_filter = function(keyword, ctg) {
			
			//Redisplay <table> and "#div_page", hide ".aboutme".
			$('table').css('display','table');
			$('#div_page').css('display','flex');
			$('.aboutme').removeClass('aboutme_show');
			
			
			//Get the collection of <tr> in <table>.
			var tr=$('table tbody tr');
			
			//Start filtering
			tr.each(function(index,row) {

				//Filter according to the "keyword" and giving the corresponding attribute to each <tr>.
				if(row.textContent.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {					
					$(row).attr('data-keyword','no');
				} else {					
					$(row).attr('data-keyword','show');
				}
				
				
				//Filter according to the "catalog" and giving the corresponding attribute to each <tr>.
				tr.each(function(index,row) {
					var rowClass=row.getAttribute('class');
					const regex=new RegExp(ctg,'ig');
					
					if(ctg == 1 || regex.test(rowClass)) {
						$(row).attr('data-ctg','show');
					} else {
						$(row).attr('data-ctg','no');
					}
				});
				
				
				//Decide which <tr> to be shown or hid according to the attributes.
				tr.each(function(index,row) {
					if($(row).attr('data-keyword') === 'show' && $(row).attr('data-ctg') === 'show') {
						row.style.display='table-row';
					} else {
						row.style.display='none';
					}
				});
				
				

				
			});
			
			//Start "_dividePage" function. "Page 1" as default.
			_dividePage(1,num_per_page);	
			
			
			
			//Set the navigation bar (.catalog and .catalog_select_PC) style.
			//For non-PC layout.
			var ctgName=$('.catalog_select a').eq(ctg-1).text();
			$('.catalog_select span').html('<img src="pics/catalog_select_arrow.png" alt="arrow">'+ctgName);
			
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
			_filter('',8);
			var aboutme = $('.aboutme');
			aboutme.addClass('aboutme_show');
			$('table').css('display','none');
			$('#div_page').css('display','none');
		}
		
		
		return {
			init() {
				
				//Add "onclick" listener on each <li> in navigation bar.
				$('div[class^="catalog_select"]  li[class="ctg_1"] a').attr('onclick','_filter("",1)');
				$('div[class^="catalog_select"]  li[class="ctg_2"] a').attr('onclick','_filter("",2)');
				$('div[class^="catalog_select"]  li[class="ctg_3"] a').attr('onclick','_filter("",3)');
				$('div[class^="catalog_select"]  li[class="ctg_4"] a').attr('onclick','_filter("",4)');
				$('div[class^="catalog_select"]  li[class="ctg_5"] a').attr('onclick','_filter("",5)');
				$('div[class^="catalog_select"]  li[class="ctg_6"] a').attr('onclick','_filter("",6)');
				$('div[class^="catalog_select"]  li[class="ctg_7"] a').attr('onclick','_filter("",7)');
				$('div[class^="catalog_select"]  li[class="ctg_8"] a').attr('onclick','_aboutme()');
				
				
				//Get parameters from url then show the correctly filtered result.
				//If no parameter is got from url, then show the default result (ctg=1, keyword="").
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
				
				
				
				//Add "onkeydown" listener on "#search_keyword"
				$('#search_keyword').keydown(function(event) {
					if(event.which === 13) {
						var keyword = $('#search_keyword').val();
						_filter(keyword,1);
						
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
						_filter(keyword,1);
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
							_filter(keyword,1);
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
