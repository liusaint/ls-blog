// define(function(require, exports){
	'use strict';
	window.areaData = {
		country: null,
		others: null
	};
	var defCountryId = '1';


    /*
     * 三级联动 地址
     * area.init('中国', '安徽', '安庆', 'angle_input', '.box');
     * 前三个是 国 省 市 的初始化值
     * 第四个 是select的class名 第五个是 下拉框组件的外部选择器(页面上有多个时候需要传)
     * @prefix name 前缀
     * */
     function Area(){
     	this.areaBox = null;
     	this.countryObj  = '.country_box';
     	this.provinceObj  = '.province_box';
     	this.cityObj = '.city_box';
        //timer 用于美化select.用于清空timer。保障只调用一次。
        this.timer;
    };

    Area.prototype = {

    	init: function(defCountry, defProvince, defCity, selectCss, areaBox, prefix){
    		var obj = this;
    		obj.selectCss = selectCss||'angle_input';
    		obj.defCountry = defCountry;
    		obj.defProvince = defProvince;
    		obj.defCity = defCity;
    		obj.areaBox = areaBox || '';
    		obj.prefix = prefix || '';

    		if(!window.areaData.country){
            	//取数据
            	if(!Area.ajaxing){
            		obj.ajaxGetArea();            		
            	}

            	//这里的第二个参数data由trigger传过来。
            	var callback = function(event,data){
            		if(data.status == 1){
            			window.areaData = data.data;
            			obj.countryData();
//            			setTimeout(function(){
//            				if(!parseInt(obj.defCountry) && !parseInt(obj.defProvince)){
//            					obj.defData();
//            				}
//            			}, 0);
            		}
            	}
            	//当有一个ajax在进行，数据还没拿到，页面上有几个地址选择，就绑定几次。
            	//数据返回之后再分别运行回调函数。ls 20160923
            	$(document).on('areaSuccess',callback);

            }else{
            	obj.countryData();
//            	setTimeout(function(){
//            	    if(!parseInt(obj.defCountry) && !parseInt(obj.defProvince)){
//            			obj.defData();
//            		}
//            	}, 0);
            }
            //下拉切换
            $('body').off('change.area',obj.areaBox+' .area_select').on('change.area', obj.areaBox+' .area_select', function(){
            	var type = $(this).data('type');
            	if(type == 'country'){
            		obj.provinceData($(this).val(), 'first');                  
            	}else if(type == 'province'){
            		obj.cityData($(this).val(), 'first');
            	}
                //切换的时候 defCountry defProvince defCity这几个值最好清零。不然有些可能无法显示到第一个选项去。比如选择澳大利亚。
                //会出现select框空白的情况。
                //ls 2016 9 22增加。
                obj.defCountry = '';
                obj.defProvince = '';
                obj.defCity = '';
                obj.beautify();//美化select
            });   
        },
        //取数据,为了避免多次取数据，将这一段提取出来。订阅发布模式。ls 20160923
        ajaxGetArea:function(){
        	Area.ajaxing = true;
        	$.ajax({
        		url : 'area.json',
        		noLoad: true,
        		success: function(data){      
        			$(document).trigger('areaSuccess',[data]);
        			Area.ajaxing = false;
        		}
        	});
        },

        countryData: function(){
        	var obj = this;
        	if(!obj.defCountry){
        	    obj.provinceData();
                return obj;
            }
        	var country = window.areaData.country;
        	var countryLen = country.length;
        	var html = $(obj.createSelect(country, 'country'));
        	if(obj.areaBox){
        		$(obj.areaBox).find(obj.countryObj).html(html);
        	}else {
        		$(obj.countryObj).html(html);
        	}
        	var id = html.val();
        	obj.provinceData(id);
        	return obj;
        },

        provinceData: function(id, index){
            var id = id || defCountryId;
        	var obj = this;
        	var others = window.areaData.others;
        	var len = others.length;
        	var province = [];
        	for(var i=0; i<len; i++){
        		if(others[i].pid == id){
        			province.push(others[i]);
        		}
        		var data = parseInt(obj.defProvince) ? others[i].id : others[i].name;
        		if(obj.defProvince && data == obj.defProvince){
        			var defId = others[i].id;
        		}
        	}
        	var html = $(obj.createSelect(province, 'province'));

            //初始化之后  改变 国家 或者省份的值  下一级默认选中第一个   否则选中传入值
            if(defId && index != 'first'){
            	html.val(defId);
            }
            var id = html.val();
            obj.cityData(id);
            if(obj.areaBox){
            	$(obj.areaBox).find(obj.provinceObj).html(html);
            }else {
            	$(obj.provinceObj).html(html);
            }
        },
        
        cityData: function(id, index){
        	var obj = this;
        	var others = window.areaData.others;
        	var len = others.length;
        	var city = [];
        	for(var i=0; i<len; i++){
        		if(others[i].pid == id){
        			city.push(others[i]);
        		}
        		var data = parseInt(obj.defCity) ? others[i].id : others[i].name;
        		if(obj.defCity && data == obj.defCity){
        			var defid = others[i].id;
        		}
        	}
        	var html = $(obj.createSelect(city, 'city'));
        	if(obj.areaBox){
        		$(obj.areaBox).find(obj.cityObj).html(html);  
        	}else {
        		$(obj.cityObj).html(html);   
        	}

            //初始化之后  改变 国家 或者省份的值  下一级默认选中第一个   否则选中传入值
            if(defid && index != 'first'){
            	html.val(defid);
            }
            return obj;
        },
        
        createSelect: function(dataArr, type){
        	var obj = this;
        	var len = dataArr.length;
        	if(len == 0){
        		return ;
        	}
        	if(obj.prefix){
        	    var html = '<select class="area_select '+obj.selectCss+'" data-type="'+type+'" name="'+obj.prefix+'_'+type+'_id">';
        	}else{
        	    var html = '<select class="area_select '+obj.selectCss+'" data-type="'+type+'" name="'+type+'_id">';
        	}
        	
        	for(var i=0; i<len; i++){
        		html += '<option value="'+dataArr[i].id+'">'+dataArr[i].name+'</option>';
        	}
        	html += '</select>';

			obj.beautify();//美化select

			return html;
		},

		/*defData: function(){
            return;
            var obj = this;
            var country = window.areaData.country;
            var others = window.areaData.others;
            var len = country.length;
            
            //判断传入的参数 是否有国家 没有默认第一个 省份
            var defCountry = obj.defCountry;
            var defProvince = obj.defProvince;
            var defData;
            var firstSelect;
            for(var i=0; i<len; i++){
                var data;
                if(defCountry){
                    defData = defCountry;
                    firstSelect = obj.countryObj;
                    data = parseInt(defCountry) ? country[i].id : country[i].name;
                }else{
                    defData = defProvince;
                    firstSelect = obj.provinceObj;
                    data = parseInt(defProvince) ? others[i].id : others[i].name;
                }
                console.log('defData' + defData);
                console.log('data' + data);
                if(data == defData){
                    var id = country[i].id;
                    if(obj.areaBox){
                        $(obj.areaBox).find(firstSelect).find('select').val(id);
                    }else{
                        $(firstSelect).find('select').val(id);
                    }
                    if(defCountry){
                        obj.provinceData(id);
                    }else{
                        obj.cityData(id);
                    }
                    break;
                }
            }
        },*/
        //除了美化，还让选项改变的时候，比如选国家，没有省份或城市，能把其.select-beautify 2016 09 22 ls增加
        beautify:function(){
        	var self = this;
        	clearTimeout(this.timer);        	
        	this.timer = setTimeout(function(){
        		var province = $(self.areaBox+' .province_box');
        		var city = $(self.areaBox+' .city_box');
        		province.show();
        		city.show();
        		$('.select-beautify').trigger('select.beautify'); 

        		if(province.find('select').length < 1){
        			province.hide(); 
        		}
        		if(city.find('select').length < 1){
        			city.hide();
        		}
        	},30)
        }
    };
    // var area = new Area();
    // return area;
// });

