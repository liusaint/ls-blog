/**
 * @author ls
 * @date  20160913
 */
 $(function(){

    /**
     * 
     * 收货信息功能：  编辑收货地址  删除收货地址 设为默认地址等
     */
     function RecipientInfo(){
     	/*简单实现单例*/
     	if (typeof RecipientInfo.instance === 'object') {
     		return RecipientInfo.instance;
     	}
     	this.addressForm = $('.editor-address');
     	this.instance = this;
     	this.area = new Area();
     	this.area.init();
     };

     RecipientInfo.prototype = {

     	init:function(formSelector){
     		this.bindEvent();
     	},

     	/*事件委派*/
     	bindEvent: function(){
     		var obj = this;
     		$('body').on('click', '.person-btn', function(){
     			var type = $(this).attr('type');
                //在下面表单为展开状态时，如果修改了上面的状态，可能会对下面的表单产生影响。所以这里设置如果点击了 submit 之外的按钮，
                //都先重置并隐藏下面的表单。让逻辑变简单。
                if(type != 'submit' && type!= 'cancel'){
                	obj.cancel();
                }
                obj[type] ?  obj[type]($(this)) : '';
            });            
     	},

     	/*设为默认地址*/
     	setDefault: function(jQobj){
     		var part = jQobj.parents('.address-part');
     		var formData = $.formSerializeFn(part);
     		var self = this;

     		var callback = function(data){
     			data.message && $.showAlert(data.message);
     			if(1 == data.status){
                    //location.reload();
                    //修改表单数据
                    formData.is_default = 1;
                    self.resetDefault(formData);
                }
                $.closeModal();
            }

            jQobj.ajax({
            	url: '/account/address/set-default',
            	data: {address_id: formData.address_id},
            	success:callback
            }).always(function(){
            	var data = {};
            	data.status = 1;
            	callback(data);
            })         
        },
        
        /*编辑地址*/
        editData: function(jQobj){
        	var part = jQobj.parents('.address-part');
        	part.addClass('bor-active');
            //给表单赋值
            this.addressForm.show();
            var formData = $.formSerializeFn(part)
            $.setFormSerialize(formData, this.addressForm); 
            this.area.init(null, formData.province_id, formData.city_id); //formData.country_id
            $('.editor-address [name="receiver"]').focus();

        },
        /*删除地址*/
        delData: function(jQobj){
        	var part = jQobj.parents('.address-part');
        	var delId = $.trim(part.find('input[name = address_id]').val());
        	var callback = function(data){
        		data.message&&$.showAlert(data.message);
        		if(data.status == 1){

                    //真正删除成功才删除dom。
                    part.remove();
                    if($('.address-part').length ==1){
                    	location.reload();
                    }
                }else{      
                    //删除失败，恢复dom.
                    part.show(); 
                }
                $.closeModal()
            }
            if(confirm('此操作不可恢复，确定要删除？')){
            	part.hide();
            	jQobj.ajax({
            		url: '/account/address/del', 
            		data: {address_id: delId},
            		success:callback
            	}).always(function(){
            		var data = {};
            		data.status = 1;
            		callback(data);
            	})
            }
        },

        /*增加地址*/
        addaddress: function(){
            //因为添加按钮也是.address-part。所以要减1
            var addLen = $('.address-part').length-1;

            // 检测是否超过最大地址。
            if(addLen >= config.maxAdressLength){
            	$.showAlert('最多可以保存'+config.maxAdressLength+'条地址，请删除部分地址后再添加！');
            	return;
            }

            this.addressForm.show();
        },

        /*保存收货信息*/
        submit: function(jqObj){
            //表单验证
            var checkAddress = false;
            var check = $.validateFn(this.addressForm);

            var formData = $.formSerializeFn(this.addressForm);

            if(!check){                
            	return;
            }

            formData.country = this.addressForm.find('select[name=country_id] option:selected').text();
            formData.province = this.addressForm.find('select[name=province_id] option:selected').text();
            formData.city = this.addressForm.find('select[name=city_id] option:selected').text();

            var self = this;
            //回调函数
            var callback;  
            var url = '/account/address/save';
            //有id的是编辑。这里对编辑处理。编辑成功，修改原位置的东西（修改原位置比较麻烦，直接重新生成整个地址dom，原位置替换）。并处理默认地址。
            if(formData.address_id){

            	callback =function(data){
            		$.showAlert(data.message);
            		if(1 == data.status){
            			var part = self.createPart(formData);
            			$('.address-part[data-id=address_'+formData.address_id+']').replaceWith(part);                
            			self.resetDefault(formData);
            			self.cancel();
            		}
            		$.closeModal()
            	}
                //这里对添加处理。添加成功。新增地址dom。并处理默认地址。
            }else{
            	delete formData.address_id;
            	callback = function(data){
            		$.showAlert(data.message);
            		if(1 == data.status){
                        //注意：需要与后台约定返回新增成功后的id
                        formData.address_id = data.data.address_id;
                        var part = self.createPart(formData);
                        //如果是默认地址，添加到地址列表前面，否则添加到后面,添加按钮前面。
                        if(formData.is_default == 1){
                        	$(".address-inner").prepend(part);
                        }else{
                        	$(".add-address-btn").before(part);
                        }               
                        self.resetDefault(formData);
                        $(".address-list-wrap").show();
                        $(".noaddress").remove();
                        self.cancel();
                    }
                    $.closeModal()
                }
            }

            jqObj.ajax({
            	url: url,
            	data: formData,
            	success:callback
            }).always(function(){
            	var data = {};
            	data.data = {}
            	data.data.address_id = Math.floor(Math.random()*1000);
            	data.status = 1;
            	callback(data);
            })  

        },
        //用来重置当前状态        
        cancel: function(){
            //清除下面的表单内容。
            $('input, select', this.addressForm).val('');
            //清除编辑状态。
            $('.bor-active').removeClass('bor-active');
            //地址重置
            this.area.init();
            //默认选中设为默认地址
            this.addressForm.find('input[type=checkbox]').prop('checked', true);
            //清空表单验证消息
            $('input.error').removeClass('error');
            $('.errorMsg').html('*');

            //如果上面的是隐藏的，那么此表单不隐藏。
            if($(".address-list-wrap").is(":hidden")){
            	return;
            }
            //隐藏表单
            this.addressForm.hide();
        },
        // 新增或编辑之后重新设置页面上的默认地址情况,传入formData
        resetDefault:function(formData){
        	var address_id = formData.address_id;
        	var part = $('.address-part[data-id=address_'+address_id+']');

            // 设为默认地址 修改所有已有地址的样式。以及隐藏表单的值。将此默认地址移动到地址位的第一位去。
            if( 1 == formData.is_default ){
            	$('.def-address').hide();
            	$('.address-part input[name=is_default]').val(0);
            	part.find('.def-address').show();
            	part.find('input[name=is_default]').val(1);
                // 设置为默认后移动到第一位去
                //part.prependTo('.address-inner');
                // 取消设为默认地址 修改此地址的样式。以及隐藏表单的值。
                $("[type=setDefault]").show();
                part.find('[type=setDefault]').hide();
            }else{
            	part.find('.def-address').hide();
            	part.find('input[name=is_default]').val(0);
            	part.find('[type=setDefault]').show();
            }

        },
        //添加一个地址dom
        createPart:function(data){
        	if(!data.address_id){
        		return false;
        	}
        	var html = '<div class="address-part iblock border" data-id="address_'+data.address_id+'">' 
        	+'<span class="def-address absolute textc '+ (data.is_default == 1?'':'hide')+'">默</span>' 
        	+'<input type="hidden" name="address_id" value="'+data.address_id+'" />' 
        	+'<input type="hidden" name="is_default" value="'+data.is_default+'"  />' 
        	+'<span class="block">'+data.receiver+'<input value="'+data.receiver+'" type="hidden" name="receiver" /></span>' 
        	+'<span class="block">'+data.phone+'<input value="'+data.phone+'" type="hidden" name="phone" /></span>' 
        	+'<span class="block">'+ (data.country||'')+' ' +(data.province||'') +' '+ (data.city||'')
        	+'<input type="hidden" name="country" value="'+data.country+'"  />'
        	+'<input type="hidden" name="country_id" value="'+data.country_id+'"  />'
        	+'<input type="hidden" name="province" value="'+data.province+'"  />'
        	+'<input type="hidden" name="province_id" value="'+data.province_id+'"  />'
        	+'<input type="hidden" name="city" value="'+data.city+'"  />'
        	+'<input type="hidden" name="city_id" value="'+data.city_id+'"  /></span>'
        	+'<span class="block adrerss">'+data.detail_address+'<input value="'+data.detail_address+'" type="hidden" name="detail_address" /></span>' 
        	+'<span class="block text-right blue btn-box"> <a class="person-btn" type="setDefault">设为默认地址</a> <a class="person-btn" type="editData">编辑</a> <a class="person-btn" type="delData">删除</a> </span>'
        	+'</div>';
        	return html;
        }
    };

    //调用
    (new RecipientInfo()).init();  

});

 // 如果编辑或添加的这个是默认地址。并且成功，那么要修改所有的默认地址的样式以及value值。
 //添加成功的话需要把id返回到页面上来。
 //当前正在编辑的才加蓝色bordr。所以cancel要取消所有的bordr.