(function () {

    var editForm = {};

	function showShortForm() {
		//clog('show form');
		var form0 = $('form#issue-form');

		var container = $('div[class="box filedroplistner"]');
		container.hide();

		$('input#time_entry_hours').attr('placeholder', 'Трудозатраты').prependTo(form0);

		var textbox = $(document.createElement('input'))
			.attr('size', 50)
			.attr('id', 'issue_notes')
			.attr('name', "issue[notes]")
			.attr('class', "wiki-edit")
			.attr('placeholder', 'Комментарий');
		$('textarea#issue_notes').prependTo(form0).replaceWith(textbox);
		textbox.focus();

		var submitB = $('input[name="commit"]').first();
		submitB.val('Обновить');

		var statuses = {
			2: 'in_progress',
			3: 'done',
			5: 'close'
		};

		var statusNames = {};
		$('select#issue_status_id option').each(function () {
			statusNames[$(this).val()] = $(this).text();
		});

		editForm.statusButtons = [];

		$.each(statuses, function (index, value) {
			var sButton = submitB.clone();
			sButton.css('margin', '3px')
			.attr('id', 'submit_'+value)
			.attr('name', 'submit_'+value)
			.attr('status_id', index);
            
            if (index in statusNames){
                sButton.val(statusNames[index]);
            }else{
                sButton.attr('disabled', 'disabled');
            }
			editForm.statusButtons.push(sButton);
		});

		/*var statusesAvailable = [];
		$('select#issue_status_id option').each(function () {
			statusesAvailable.push($(this).val());
		});*/
		console.log(editForm.statusButtons);

		form0.append(editForm.statusButtons);

		$(form0).find('a:visible').hide();
		return true;
	}

	function addFullEditForm() {
		var aE = 'a.icon.icon-edit';
		$(aE).first().clone().text('Расширеная форма').attr('id', 'edit_restore').insertAfter(aE);

		//возвращаем полную форму на место
		$(document).on('click', '#edit_restore', function () {
			$(editForm.divForm).replaceWith(editForm.divFormBackup);
			$('form#issue-form').append(editForm.statusButtons);
			$("div#update").show();
			//return false;
		});
	}

	$(document).ready(function () {
		//clog("Comment works");

		//делаем краткую форму редактирования
		if (window.location.pathname.indexOf('/issues/') == -1) {
			//нецелевая страница
			return;
		}

		var eventCounter = 0;

		editForm.divForm = $("div#update");
		editForm.divFormBackup = editForm.divForm.clone();

		document.documentElement.addEventListener('DOMAttrModified', function (e) {
			if (e.attrName === 'style' && e.target == editForm.divForm.get(0) && editForm.divForm.is(':visible') && eventCounter === 0) {
				if (showShortForm()) {
					eventCounter++;
				}
			}
		}, false);

		//function makeSubmitButtons(){}

		//обработка дополнительных кнопок
		$('form#issue-form').submit(function (event) {

			var action = document.activeElement;

			if (action.status_id > 0) {
				$('select[name="issue[status_id]"]').val(action.status_id);
			}
			if (action.id == 'submit_done') {
				var authorUrl = $("div.issue.details p.author a.user.active").attr('href');
				if (authorUrl.indexOf('/users/') !== 0) {
					console.log("author unknown");
					return false;
				}
				var author_id = authorUrl.substring(7);
				console.log("author: " + author_id);

				$('select[name="issue[assigned_to_id]"]').val(author_id);
			}
			//clog($(this).serializeArray());
			return true;
		});

		//ссылка на полную форму редактирования
		addFullEditForm();

	});

})();
