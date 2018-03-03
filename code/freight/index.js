$(function() {
	
	/* 
	运费管理

	ls
	20160929 
	*/

	function Freight(){

		/*简单实现单例*/
		if (typeof Freight.instance === 'object') {
			return Freight.instance;
		}


	}

	Freight.prototype = {
		//初始化
		init:function(){
			this.modalInit();
			this.bindEvent();
			this.loadProvince();
			this.COUNTRY = 1;
			this.PROVINCE = 2;
		},
		//初始化模态框
		modalInit:function(){
			//满额包邮模态框
			this.fullModal = dialog({
				padding:0,
				content: $(".area-modal[type=full]")
			});
			//普通运费模态框
			this.normalModal = dialog({
				padding:0,
				content: $(".area-modal[type=normal]")
			});
			//地区包邮模态框
			this.areaModal = dialog({
				padding:0,
				content: $(".area-modal[type=area]")
			});
			//初始化之后删除原始modal
			$(".hidden .area-modal").remove();
		},
		// 关闭模态框
		closeModal:function(){
			this.fullModal.close();
			this.normalModal.close();
			this.areaModal.close();
		},
		//事件绑定
		bindEvent:function(){
			var self = this;

			//添加按钮，显示一个初始状态的模态框
			$("body").on('click', '.freight-add-btn', function(event) {
				var liBox = $(this).parents('.freight-part');
				var type = liBox.attr('type');
				//弹出对应模态框
				self[type+'Modal']&&self[type+'Modal'].showModal();
				self.resetModal(type);				
			});
			//关闭模态框
			$("body").on('click', '.freight-cancel-btn,.freight-close-btn', function(event) {
				self.closeModal();
			});
			//提交
			$("body").on('click', '.freight-ensure-btn', function(event) {
				var type = $(this).parents('.area-modal').attr('type');
				//弹出对应模态框
				self[type+'Submit']&&self[type+'Submit']($(this));
			});
			//显示地区与否
			$("body").on('click', 'input[name=area_radio]', function(event) {
				var box = $(this).parents('.area-modal');
				var areaList = box.find('.area-list');
				var type = $(this).val();
				if(type == self.COUNTRY ){
					areaList.hide();
				}else{
					areaList.show();
				}
			});
			//编辑和删除li
			$("body").on('click', '.li-btn', function(event) {
				var type = $(this).attr('type');
				self[type] ?  self[type]($(this)) : '';
			});

			//全选
			$("body").on('click', '#all_province input[type=checkbox]', function(event) {
				var liBox = $(this).parents('.area-modal');
				liBox.find('input[name=area_checkbox]:not([disabled])').prop('checked', $(this).prop('checked'));
				
			});
			//单选
			$("body").on('click', '.area-modal[type=normal] .area-list input[name=area_checkbox]:not([disabled])', function(event) {
				self.checkAllSelect();
			});

		},
		//地区包邮提交
		areaSubmit:function(jqObj){


			var modalbox = $('.area-modal[type=area]');
			var liBox = $(".freight-part[type=area]");

			//js逻辑用的数组
			var resData = this.getModalData('area');
			var self = this;

			//回调函数
			var callback = function(data){
				data.message&&$.showAlert(data.message);
				if(data.status == 1){
					var htmlObj;
					//检测地区包邮是否已经创建了td.没有则创建 
					if(liBox.find('.freight-item').length<1){
						htmlObj = $(self.createLi('area'));
						liBox.find(".freight-items").prepend(htmlObj);
						resData.id = data.id;
					}else{
						htmlObj = liBox.find('.freight-item');
					}
					//隐藏添加按钮
					liBox.find(".freight-add-btn").hide();
					//给创建的li填充数据
					self.setLiData(htmlObj,resData);
					//关闭模态
					self.closeModal();
				}
			}

			//检测数据是否合法
			if(!this.checkData('area',resData)){
				return;
			}

			//数据转换
			var upData = this.transUpData('area',resData);

			//数据提交
			jqObj.ajax({
				url: 'save',	
				data: upData,
				success:callback
			})
			.always(function() {
				var data = {};
				data.status = 1;
				data.id = resData.id || Math.floor(Math.random()*1000);
				callback(data);
			});
		},
		//普通运费提交
		normalSubmit:function(jqObj){			

			var modalbox = $('.area-modal[type=normal]');
			var liBox = $(".freight-part[type=normal]");

			var resData = this.getModalData('normal');
			var self = this;

			var callback = function(data){
				data.message&&$.showAlert(data.message);
				if(data.status == 1){
					var htmlObj;
					//检测地区包邮是否已经创建了td.没有则创建 
					if(!resData.id){
						//id替换
						resData.id = data.id;
						//默认的保持不变
						if($("#the_country").is(':hidden')){
							htmlObj = $(self.createLi('normal'));
							liBox.find(".freight-items").append(htmlObj);
						}else{
							htmlObj = liBox.find('.freight-item.special');
						}
						
					}else{	
						htmlObj = liBox.find('.freight-item[dataid='+resData.id+']');
					}

					//给创建的li填充数据
					self.setLiData(htmlObj,resData);
					//关闭模态
					self.closeModal();
				}
			}

			//检测数据是否合法
			if(!this.checkData('normal',resData)){
				return;
			}
			//数据转换
			var upData = this.transUpData('normal',resData);

			jqObj.ajax({
				url: 'supplier-freight/save',	
				data: upData,
				success:callback
			})
			.always(function() {
				var data = {};
				data.status = 1;
				data.id = resData.id || Math.floor(Math.random()*1000);
				callback(data);
			});
		},
		//满额包邮提交
		fullSubmit:function(jqObj){
			var modalbox = $('.area-modal[type=full]');
			var liBox = $(".freight-part[type=full]");

			var resData = this.getModalData('full');
			var self = this;

			var callback = function(data){
				data.message&&$.showAlert(data.message);
				if(data.status == 1){
					var htmlObj;
					//检测地区包邮是否已经创建了td.没有则创建 
					if(!resData.id){
						//id
						resData.id = data.id;

						htmlObj = $(self.createLi('full'));
						liBox.find(".freight-items").append(htmlObj);
					}else{
						htmlObj = liBox.find('.freight-item[dataid='+resData.id+']');
					}

					//给创建的li填充数据
					self.setLiData(htmlObj,resData);
					//关闭模态
					self.closeModal();
				}
			}

			//检测数据是否合法
			if(!this.checkData('full',resData)){
				return;
			}

			//数据转换
			var upData = this.transUpData('full',resData);

			jqObj.ajax({
				url: 'supplier-freight/save',	
				data: upData,
				success:callback
			})
			.always(function() {
				var data = {};
				data.status = 1;
				data.id = resData.id || Math.floor(Math.random()*1000);
				callback(data);
			});
		},
		//使用最终的确认的数据来修改li。
		setLiData:function(jqObj,data){

			jqObj.find('.province-td').html(data.provinceArr.join('、'));
			jqObj.find('.money-td').html('￥'+data.money);
			jqObj.attr("money",data.money);
			jqObj.attr('areaid',data.provinceIdArr.join('-'))
			jqObj.attr('areatype',data.areatype);
			jqObj.attr('dataid',data.id);

		},
		//从li上面获取对应的数据。这里传递的jqObj应该为li。
		getLiData:function(jqObj){
			var data = {};
			var provinceIdStr = jqObj.attr('areaid')||'';

			data.areatype = jqObj.attr('areatype')||this.PROVINCE;
			data.provinceIdArr = provinceIdStr.split("-");
			data.id = jqObj.attr('dataid')||'';
			data.money = jqObj.attr('money')||'';

			return data;
		},
		//用从li上面获取modaldata更新模态框。这里传递的jqObj应该为li。
		setModalData:function(data,type){
			var modalBox = $('.area-modal[type='+type+']');

			//是否有dataid
			modalBox.attr('dataid', data.id);

			//选择全国还是地区
			modalBox.find('input[type=radio][value='+data.areatype+']').prop('checked', true);
			modalBox.find('input[type=radio]:checked').trigger('click');

			//如果有省份的数据，则更新checkbox
			if(data.areatype == this.PROVINCE){
				var provinceLen = data.provinceIdArr.length;
				var i = 0;
				//全不选
				modalBox.find('input[type=checkbox]').prop('checked', false);
				//初始选中
				for (i = 0; i < provinceLen; i++) {
					
					modalBox.find('input[type=checkbox][value='+data.provinceIdArr[i]+']').prop('checked', true);
				}
			}else{
				//全不选
				modalBox.find('input[type=checkbox]').prop('checked', false);
			}
			//检测哪些省份不能点
			this.checkProvince(type,data.id);
			this.checkAllSelect();

			//如果有金额信息的话
			if(modalBox.find('input[type=text]').length>0){
				modalBox.find('input[type=text]').val(data.money);
			}

		},
		//获取模态框中输入的信息
		getModalData:function(type){
			var modalBox = $(".area-modal[type="+type+"]");
			var data = {};

			//数据id
			data.id = modalBox.attr('dataid')||'';

			//获取地区类型
			var areatype =  modalBox.find('input[name=area_radio]:checked').val();
			data.areatype = areatype;

			if(type == 'normal' && $("#the_country").is(':hidden')){
				data.areatype = this.PROVINCE;
			}

			//如果是选了地区的，则需要拼装地址id的Arr。以及地址中文的id。
			if(data.areatype == this.PROVINCE){
				var provinceIdArr = [];
				var provinceArr = [];
				var inputCheckboxDoms = modalBox.find('input[name=area_checkbox]:checked');
				var checkLen = inputCheckboxDoms.length;
				
				for (var i = 0; i < checkLen; i++) {
					provinceIdArr.push(inputCheckboxDoms.eq(i).val());
					provinceArr.push(inputCheckboxDoms.eq(i).closest('li').text());
				}
				data.provinceIdArr = provinceIdArr;
				data.provinceArr = provinceArr;
			}else{
				data.provinceIdArr = [];
				data.provinceArr = ['全国'];
			}

			//如果有输入金额，刚获取金额数据
			var moneyDom = modalBox.find("input[type=text]"); 
			if(moneyDom.length > 0 ){
				data.money = moneyDom.val();
			}
			return data;
		},
		//新建一个li
		createLi:function(type){
			//不同类型的li的不同点。
			var htmlPartObj = {
				full:{},
				normal:{},
				area:{}
			};
			htmlPartObj.full.moneytr = '<tr> <td class="middle-td">包邮金额：</td> <td class="money-td orange"></td> </tr>';
			htmlPartObj.full.addtr = '<tr> <td>地区：</td><td  class="province-td"></td> </tr>';

			htmlPartObj.normal.moneytr= '<tr><td class="small-td">运费：</td><td class="money-td orange"></td></tr>';
			htmlPartObj.normal.addtr = '<tr> <td>地区：</td><td class="province-td"></td> </tr>';

			htmlPartObj.area.moneytr = '';
			htmlPartObj.area.addtr = '<tr> <td class="long-td">默认包邮地区：</td> <td class="province-td"></td> </tr>';

			var html = '<li class="freight-item relative" dataid="" areatype = "" areaid="">'
			+'<table class="freight-table">'
			+(htmlPartObj[type]&&htmlPartObj[type].moneytr)
			+(htmlPartObj[type]&&htmlPartObj[type].addtr)
			+'</table>'
			+'<div class="item-right-btns">'
			+'<i class="freight-edit-btn li-btn" type="showEditLi">改</i>'
			+'<i class="freight-del-btn li-btn" type="delLi" >删</i>'
			+'</div>'
			+'</li>';
			//返回拼装好的不包含数据的li
			return html;

		},
		//删除li
		delLi:function(jqObj){
			var liJq = jqObj.parents('.freight-item');
			var liBox = jqObj.parents('.freight-part');
			var type = liBox.attr('type');
			var freight_id = liJq.attr('dataid');

			var callback = function(data){
				data.message&&$.showAlert(data.message);
				if(data.status == 1){
					liJq.remove();
					if(type == 'area'){
						liBox.find(".freight-add-btn").show();
					}
				}
			}

			var  html ='<div class="mt40 mb30 text-center"><p>是否确认删除？</p><p class="red">（删除后不可恢复）</p></div>';
			var d = dialog({

				title: '删除提示',
				content: html,
				okValue: '确 定',
				ok: function () {
              		//批量删除数据
              		jqObj.ajax({
              			type : "POST",
              			url : 'supplier-freight/del',
              			data : {freight_id:freight_id},
              			success : callback
              		}).always(function(){
              			// 测试
              			var data = {};
              			data.status = 1;
              			callback(data);
              		});

              	},
              	cancelValue: '取消',
              	cancel: function () {
              	}
              });
			d.showModal();


		},
		//编辑li
		showEditLi:function(jqObj){
			var liJq = jqObj.parents('.freight-item');
			var box = jqObj.parents('.freight-part');
			var type = box.attr('type');
			var modalBox = $(".area-modal[type="+type+"]");
			//弹出对应模态框
			this[type+'Modal']&&this[type+'Modal'].showModal();
			//获取li的数据写到模态框里
			var data = this.getLiData(liJq);
			this.setModalData(data,type);
			//针对普通运费做的特别处理
			if(type == 'normal'){
				if(liJq.hasClass('special')){
					// modalBox.find('.area-radios-wrap').show();
					modalBox.find('#the_country').show();
					modalBox.find('#all_province').hide();
					modalBox.find('.area-list').hide();
				}else{
					// modalBox.find('.area-radios-wrap').hide();
					modalBox.find('#the_country').hide();
					modalBox.find('#all_province').show();
					modalBox.find('.area-list').show();
				}

			}

		},
		//重置modal
		resetModal:function(type){
			var modalBox;
			if(type){
				modalBox = $(".area-modal[type="+type+"]");
			}else{
				modalBox = $(".area-modal");
			}

			//选择地区
			modalBox.attr('dataid', '');
			//如果是普通运费，默认选择全国
			//显示地区选择
			if(type == 'normal'){
				modalBox.find('input[type=radio][value='+this.COUNTRY+']').prop('checked', true);
				modalBox.find('#the_country').hide();
				modalBox.find('#all_province').show();

				modalBox.find('.area-list').show();
			}else{
				modalBox.find('input[type=radio][value='+this.PROVINCE+']').prop('checked', true);
				//改变之后触动它的点击事件，引起下面省份的消失与出现。
				modalBox.find('input[type=radio]:checked').trigger('click');
			}


			modalBox.find('input[type=checkbox]').prop('checked', false);
			modalBox.find('input[type=text]').val('');

			this.checkProvince(type);
		},
		// 检测哪些地区是已经选择过的。让其变成不可选的状态
		checkProvince:function(type,dataid){

			if(!type){
				return;
			}
			//地区包邮的不需要检测
			if(type == 'area'){
				return;
			}

			var liBox = $(".freight-part[type="+type+"]");
			var modalBox = $(".area-modal[type="+type+"]");

			var disabledItemDoms = liBox.find('.freight-item[dataid!='+dataid+']');

			var domLen = disabledItemDoms.length;
			var disabledIdArr = [];
			var areaid = '';

			for (var i = 0; i < domLen; i++) {
				areaid = disabledItemDoms.eq(i).attr('areaid')||'';
				if(areaid){

					disabledIdArr = disabledIdArr.concat(areaid.split("-"));
				}
			}

			var idLen = disabledIdArr.length;
			modalBox.find('input[type=checkbox]').prop('disabled', false);
			modalBox.find('input[type=checkbox]').parents('li.disabled').removeClass('disabled');
			for (var i = 0; i < idLen; i++) {
				modalBox.find("input[type=checkbox][value="+disabledIdArr[i]+"]").prop('disabled', true);
				modalBox.find("input[type=checkbox][value="+disabledIdArr[i]+"]").parents('li').addClass('disabled');
			}	


		},
		//数据检测。金额是否合法。选择框是否至少选择了一个。
		//普通运费：全国那一项，只检测金额。地区那一项，金额和地区都要检测。
		//满额包邮：选地区的时候检测金额与地区，全国的时候检测金额。
		//地区包邮：检测是否选择了一个地区或全国
		checkData:function(type,data){


			var modalBox = $('.area-modal[type='+type+']');
			//地区检测。如果选择的地区，则至少选择一个省份。
			if((type=='normal'&& modalBox.find('#the_country').is(':hidden'))|| this.PROVINCE == modalBox.find("input[type=radio]:checked").val()){
				if(modalBox.find("input[name=area_checkbox]:checked").length<1){	
					$.showAlert('请至少选择一个地区');
					return false;
				}
			}

			//金额检测。地区包邮的不用检测。
			if(type!='area' && (data.money == '' || isNaN(data.money)||data.money<0)){			
				modalBox.find("input[type=text]").focus();
				$.showAlert('请输入正确的金额');
				return false;
			}
			//前面的都通过，则返回true;
			return true;

		},
		//转换上传时的数据-添加
		transUpData:function(type,data){
			if(!type || !data){
				console.log('pram error!');
				return;
			}
			//用于返回
			var res = {};

			if(data.id){
				res.id = data.id;
			}

			if(this.COUNTRY == data.areatype){
				res.district_ids = [1];
			}else{
				res.district_ids = data.provinceIdArr;
			}

			res.freight = 0;
			res.total_price = 0;
			//转为2位小数
			data.money = this.toDecimal2(data.money);
			//满额包邮 
			if('full' == type){
				res.total_price = data.money;
			}

			if('normal' == type){
				res.freight = data.money;
			}
			return res;

		},
		//全选检测
		checkAllSelect:function(){
			var inputCheckboxDoms = $(".area-modal[type=normal] .area-list input[name=area_checkbox]:not([disabled])");
			var inputCheckboxDomsChecked = $(".area-modal[type=normal] .area-list input[name=area_checkbox]:checked:not([disabled])");

			$("#all_province input[type=checkbox]").prop('checked',inputCheckboxDoms.length == inputCheckboxDomsChecked.length);	
		},
		//加载省份
		loadProvince:function(){		
			var html = '<li><input type="checkbox" name="area_checkbox" value="241">北京</li><li><input type="checkbox" name="area_checkbox" value="242">天津</li><li><input type="checkbox" name="area_checkbox" value="243">河北</li><li><input type="checkbox" name="area_checkbox" value="244">山西</li><li><input type="checkbox" name="area_checkbox" value="245">内蒙古</li><li><input type="checkbox" name="area_checkbox" value="246">辽宁</li><li><input type="checkbox" name="area_checkbox" value="247">吉林</li><li><input type="checkbox" name="area_checkbox" value="248">黑龙江</li><li><input type="checkbox" name="area_checkbox" value="249">上海</li><li><input type="checkbox" name="area_checkbox" value="250">江苏</li><li><input type="checkbox" name="area_checkbox" value="251">浙江</li><li><input type="checkbox" name="area_checkbox" value="252">安徽</li><li><input type="checkbox" name="area_checkbox" value="253">福建</li><li><input type="checkbox" name="area_checkbox" value="254">江西</li><li><input type="checkbox" name="area_checkbox" value="255">山东</li><li><input type="checkbox" name="area_checkbox" value="256">河南</li><li><input type="checkbox" name="area_checkbox" value="257">湖北</li><li><input type="checkbox" name="area_checkbox" value="258">湖南</li><li><input type="checkbox" name="area_checkbox" value="259">广东</li><li><input type="checkbox" name="area_checkbox" value="260">广西</li><li><input type="checkbox" name="area_checkbox" value="261">海南</li><li><input type="checkbox" name="area_checkbox" value="262">重庆</li><li><input type="checkbox" name="area_checkbox" value="263">四川</li><li><input type="checkbox" name="area_checkbox" value="264">贵州</li><li><input type="checkbox" name="area_checkbox" value="265">云南</li><li><input type="checkbox" name="area_checkbox" value="266">西藏</li><li><input type="checkbox" name="area_checkbox" value="267">陕西</li><li><input type="checkbox" name="area_checkbox" value="268">甘肃</li><li><input type="checkbox" name="area_checkbox" value="269">青海</li><li><input type="checkbox" name="area_checkbox" value="270">宁夏</li><li><input type="checkbox" name="area_checkbox" value="271">新疆</li>';

			$(".area-list").html(html);
		},
		//制保留2位小数，如：2，会在2后面补上00.即2.00    
		toDecimal2:function(x) {    
			var f = parseFloat(x);    
			if (isNaN(f)) {    
				return x;    
			}    
			var f = Math.round(x*100)/100;    
			var s = f.toString();    
			var rs = s.indexOf('.');    
			if (rs < 0) {    
				rs = s.length;    
				s += '.';    
			}    
			while (s.length <= rs + 2) {    
				s += '0';    
			}    
			return s;    
		}  

	}
	var freight = new Freight;
	freight.init();

});