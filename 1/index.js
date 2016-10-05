/*多级联动

*author:ls
*date:20161004
*email:841766635@qq.com
*/

function initProductSelect(type){

	var callback = function(data){
		if(data.status == 1){
					//缓存结果
					initProductSelect.cache[type] = data;
				//找到一这个type所在的select;
				var lastSelect = $("option[code="+type+"]").parent();
				lastSelect.nextAll('select').remove();
				var selectData = data.data;
				var len = selectData.length;
				
				if($(".js_type_select_input").length>0 && !$(".js_type_select_input").is(':hidden')){

				}else{
					$("select.code").removeClass('code');					
					$(".js_type_select_wrap select:last").addClass('code');
				}
				if(len == 0){
					return;
				}

				var html = '<select class="form-control select_box type_select" code = "'+type+'">';
				var item = '';

				for (var i = 0; i < len; i++) {
					item = '<option value ="'+selectData[i].code+'" code="'+selectData[i].code+'">'+selectData[i].name+'</option>';
					html = html + item;
				}
				html = html + '</select>';

				$(".js_type_select_wrap").append(html);
				$(".type_select[code="+type+"]").trigger('change');		
			}
		}
		var theAjax = function(){
			if(!initProductSelect.cache){
				initProductSelect.cache = {};
			}
			
			if(initProductSelect.cache[type]){
				callback(initProductSelect.cache[type]);
			}else{
				$.ajax({
					url: 'data.php',
					type: 'get',
					dataType: 'json',
					data: {code: type},
					success:callback
				})
			}

		}

		theAjax();

		$("body").off('change.type_select').on('change.type_select', '.type_select', function(event) {
			var code  = $(this).find('option:selected').attr('code');
			initProductSelect(code);

		});
		$("body").off('click.type_select').on('click.type_select', '.js_type_select_input', function(event) {
			$(this).hide();
			$(this).parent().find('input').removeClass('code');
			$(this).parent().removeClass('hide-select');
			$(".js_type_select_wrap select:last").addClass('code');
		});

	}

	initProductSelect(1);

	$("body").on('click', '#code', function(event) {
		alert('要提交的code值为'+$(".code").val());
	});