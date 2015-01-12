$.flutuante = function( selector, settings ){

	var flutuante = { selector : selector, defaults : {}, vars: { visible: false, initialized: false, viewed: false  }, functions : {} };

	flutuante.defaults = {
		animationSpeed : 0.5, //Velocidade da animação em segundos.
		topDistance: '100', //Distância entre o topo e o float em pixels.
		overlaySelector: 'overlay', //Classe da div overlay que cobre o site.
		actionSelector: 'action', //Classe do link do banner.
		closeSelector: 'close', //Classe do botão fechar.
		closeText : 'X', //Texto do botão fechar.
		closeTimer: 0, //Em segundos
		displayAuto: true, //Indica se ele deve ser exibido automaticamente quando o plugin for instanciado.
		hideWhenView: false //Se for passado uma hash/id o float será exibido somente se o usuário não clicou no link ainda.
	}

	$.extend( flutuante.defaults, settings );

	flutuante.functions = {
		init : function(){
			if(  !$(flutuante.selector).length ){
				//Atribui a exceção caso o elemento do float não for encontrado.
				flutuante.vars.exception = "Não foi encontrado o elemento do float na página.";
				//Retorna indicando que o plugin não foi inicializado.
				return flutuante;
			}else{
				//Chama a função que executa os calculos do plugin.
				flutuante.functions.calc();
				//Atribui no resize da tela a função que calcula os tamanhos.
				$( window ).resize(flutuante.functions.calc);
				//Define que o plugin foi inicializado.
				flutuante.vars.initialized = true;
				//Seta evento para gravar no cookie se o usuário ja visualizou.
				if( flutuante.defaults.hideWhenView ){
					if( !flutuante.functions._getCookie( flutuante.defaults.hideWhenView ) ){
						$('.'+flutuante.defaults.actionSelector).on('click', function(){
							flutuante.functions._setCookie(  flutuante.defaults.hideWhenView, true );
							flutuante.vars.viewed = true;
						});
					}else{
						flutuante.vars.viewed = true;
					}
				}
				//Chama a função para mostrar o float de estiver setado para abrir automaticamente.
				if( flutuante.defaults.displayAuto && flutuante.vars.viewed == false ){
					flutuante.functions.open();
				}
				//Retorna o objeto do plugin.
				return flutuante;
			}
		},
		open: function(){
			if( flutuante.vars.initialized == true && flutuante.vars.viewed == false  ){
				//Cria botão fechar.
				$(flutuante.selector).prepend('<a href="javascript:void(0);" class="'+flutuante.defaults.closeSelector+'">'+flutuante.defaults.closeText+'</a>');
				//Cria overlay.
				$('body').append('<div class="'+flutuante.defaults.overlaySelector+'"></div>').find('.'+flutuante.defaults.overlaySelector).fadeIn(1000*flutuante.defaults.animationSpeed).on('click', flutuante.functions.close );
				//Exibe modal.
				$(flutuante.selector).animate({ top: flutuante.defaults.topDistance }, 1000*flutuante.defaults.animationSpeed).find('.'+flutuante.defaults.closeSelector).on('click', flutuante.functions.close );
				//Seta timer.
				if( flutuante.defaults.closeTimer > 0 ){
					flutuante.defaults.timer = setTimeout( flutuante.functions.close, flutuante.defaults.closeTimer * 1000 );
				}
				//Indica que o float está visivel.
				flutuante.vars.visible = true;
				return true;
			}else{
				flutuante.vars.exception = "Não foi possível abrir o float pois ele não foi inicializado ou já foi visualizado.";
				return false;
			}
		},
		close : function(){
			if( flutuante.vars.visible ){
				//Faz animação do float.
				$(flutuante.selector).animate({ top: '-150%' }, 1000*flutuante.defaults.animationSpeed);
				//Faz animação da overlay e remove.
				$('.'+flutuante.defaults.overlaySelector).fadeOut(1000*flutuante.defaults.animationSpeed, function(){ $('.'+flutuante.defaults.overlaySelector).remove(); });
				//Indica que o float não está visivel.
				flutuante.vars.visible = false;
				return true;
			}else{
				flutuante.vars.exception = "O float já está fechado.";
				return false;
			}
		},
		calc : function(){
			//Define o tamanho da tela.
			flutuante.vars.screenSize = $(window).width();
			if( flutuante.vars.screenSize < 800 ){
				//Adiciona classe para versão mobile.
				$(flutuante.selector).removeClass('desktop').addClass('mobile');
				//Define o dispotivo atual.				
				flutuante.vars.dispositive = 'mobile';
			}else{
				//Calcula margin para versão desktop.
				$(flutuante.selector).css('margin-left', - $(flutuante.selector).width() / 2 );
				//Adiciona classe para versão desktop.
				$(flutuante.selector).removeClass('mobile').addClass('desktop');
				//Define o dispotivo atual.			
				flutuante.vars.dispositive = 'desktop';
			}
		},
		_setCookie : function(name, value, days){
			var date = new Date();
			date.setDate(date.getDate() + days);

			var cookie = escape(value) + ((days==null) ? '' : '; expires=' + date.toUTCString());
			document.cookie = name + '=' + cookie;
		},
		_getCookie : function(name){
				var cookie = document.cookie;
				var start = cookie.indexOf(" " + name + "=");

				if (start == -1) {
					start = cookie.indexOf(name + "=");
				}

				if (start == -1) {
					cookie = null;
				} else {
					start = cookie.indexOf("=", start) + 1;

					var end = cookie.indexOf(";", start);

					if (end == -1) {
						end = cookie.length;
					}

					cookie = unescape(cookie.substring(start, end));
				}

				return cookie;
		}
	}
	//Retorna o retorno da função que inicializa o plugin.
	return flutuante.functions.init();
};