/* ============================================
   GRÁFICA ARO - JAVASCRIPT INTERATIVO
   Funcionalidades:
   - Rolagem suave customizada (easeInOutCubic)
   - Menu mobile responsivo
   - Animações ao rolar
   - Validação de formulário
   - Destaque de menu ativo
   - Contador animado
   - Filtro de portfólio
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ============================================
  // ELEMENTOS DO DOM
  // ============================================
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const orcamentoForm = document.getElementById("orcamentoForm");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const animateElements = document.querySelectorAll(".animate-on-scroll");
  
  // ============================================
  // ROLAGEM SUAVE CUSTOMIZADA (easeInOutCubic)
  // Função principal que anima o scroll da página
  // com uma curva de aceleração/desaceleração suave
  // ============================================

  /**
   * Função de easing easeInOutCubic
   * Produz uma animação que acelera suavemente no início
   * e desacelera suavemente no final.
   * @param {number} t - Progresso de 0 a 1
   * @returns {number} - Valor eased de 0 a 1
   */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Rola a página suavemente até a posição desejada.
   * @param {number} targetY - Posição vertical de destino (em px)
   * @param {number} duration - Duração da animação em milissegundos (padrão: 900)
   */
  function smoothScrollTo(targetY, duration) {
    duration = duration || 900;

    var startY = window.pageYOffset || document.documentElement.scrollTop;
    var distance = targetY - startY;
    var startTime = null;

    // Se a distância é muito pequena, não anima
    if (Math.abs(distance) < 2) return;

    // Ajusta duração proporcionalmente à distância (mín 400ms, máx 1200ms)
    var adjustedDuration = Math.max(
      400,
      Math.min(1200, Math.abs(distance) * 0.5),
    );
    if (duration !== 900) {
      adjustedDuration = duration; // Usa a duração passada se for explícita
    }

    function step(currentTime) {
      if (startTime === null) startTime = currentTime;

      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / adjustedDuration, 1);
      var easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Calcula a posição de destino considerando a altura do header fixo
   * e rola suavemente até o elemento alvo.
   * @param {string} targetSelector - Seletor CSS do elemento alvo (ex: "#servicos")
   * @param {number} extraOffset - Offset extra em px (padrão: 10)
   */
  function scrollToSection(targetSelector, extraOffset) {
    extraOffset = extraOffset || 10;

    var target = document.querySelector(targetSelector);
    if (!target) return;

    var headerHeight = header ? header.offsetHeight : 76;
    var targetRect = target.getBoundingClientRect();
    var targetY =
      targetRect.top + window.pageYOffset - headerHeight - extraOffset;

    // Garante que não rola para valor negativo
    targetY = Math.max(0, targetY);

    smoothScrollTo(targetY);
  }

  // ============================================
  // INTERCEPTAR TODOS OS LINKS COM href="#..."
  // Aplica rolagem suave em TODOS os links internos:
  // menu, botões CTA, links de serviço, footer, etc.
  // ============================================
  function setupSmoothScrollLinks() {
    var allAnchorLinks = document.querySelectorAll('a[href^="#"]');

    allAnchorLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var targetId = this.getAttribute("href");

        // Ignora links que são apenas "#"
        if (!targetId || targetId === "#") return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // Fecha o menu mobile se estiver aberto
        if (nav.classList.contains("open")) {
          closeMenu();
        }

        // Rola suavemente até a seção
        scrollToSection(targetId);

        // Atualiza a URL no navegador sem recarregar
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  setupSmoothScrollLinks();

  // ============================================
  // OVERLAY DO MENU MOBILE
  // ============================================
  var navOverlay = document.createElement("div");
  navOverlay.className = "nav-overlay";
  document.body.appendChild(navOverlay);

  // ============================================
  // MENU MOBILE
  // ============================================
  function openMenu() {
    menuToggle.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    nav.classList.add("open");
    navOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    navOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", function () {
    if (nav.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener("click", closeMenu);

  // Fechar menu com tecla Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
    }
  });

  // ============================================
  // HEADER SCROLL (adicionar sombra)
  // ============================================
  function handleHeaderScroll() {
    var scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // ============================================
  // DESTAQUE DE MENU ATIVO
  // ============================================
  var sections = document.querySelectorAll("section[id]");

  function highlightActiveNav() {
    var scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // ============================================
  // ANIMAÇÕES AO SCROLL (Intersection Observer)
  // ============================================
  var observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.15,
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  }, observerOptions);

  animateElements.forEach(function (el) {
    observer.observe(el);
  });

  // ============================================
  // CONTADOR ANIMADO (Hero Stats)
  // ============================================
  var counters = document.querySelectorAll(".stat-number[data-count]");
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute("data-count"));
      var duration = 2000;
      var startTime = performance.now();

      function updateCounter(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        // Easing: ease-out
        var easeOut = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(easeOut * target);

        counter.textContent = current.toLocaleString("pt-BR");

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });

    countersAnimated = true;
  }

  // Observer para iniciar contadores quando a hero stats estiver visível
  var statsSection = document.querySelector(".hero-stats");
  if (statsSection) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    statsObserver.observe(statsSection);
  }

  // ============================================
  // FILTRO DE PORTFÓLIO
  // ============================================
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = this.getAttribute("data-filter");

      // Atualizar botão ativo
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");

      // Filtrar itens
      portfolioItems.forEach(function (item) {
        var category = item.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          item.classList.remove("hidden");
          item.style.animation = "fadeInUp 0.5s ease forwards";
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  // ============================================
  // VALIDAÇÃO DO FORMULÁRIO
  // ============================================
  function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(fieldId + "Error");
    if (field) field.classList.add("error");
    if (error) error.textContent = message;
  }

  function clearError(fieldId) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(fieldId + "Error");
    if (field) field.classList.remove("error");
    if (error) error.textContent = "";
  }

  function clearAllErrors() {
    ["nome", "servico", "mensagem"].forEach(clearError);
  }

  function validateForm() {
    var isValid = true;
    clearAllErrors();

    // Nome
    var nome = document.getElementById("nome").value.trim();
    if (!nome) {
      showError("nome", "Por favor, informe seu nome.");
      isValid = false;
    } else if (nome.length < 3) {
      showError("nome", "O nome deve ter pelo menos 3 caracteres.");
      isValid = false;
    }

    // Serviço
    var servico = document.getElementById("servico").value;
    if (!servico) {
      showError("servico", "Por favor, selecione um serviço.");
      isValid = false;
    }

    // Mensagem
    var mensagem = document.getElementById("mensagem").value.trim();
    if (!mensagem) {
      showError("mensagem", "Por favor, descreva seu pedido.");
      isValid = false;
    } else if (mensagem.length < 10) {
      showError("mensagem", "A descrição deve ter pelo menos 10 caracteres.");
      isValid = false;
    }

    return isValid;
  }

  // Limpar erro ao digitar
  ["nome", "servico", "mensagem"].forEach(function (fieldId) {
    var field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", function () {
        clearError(fieldId);
      });
      field.addEventListener("change", function () {
        clearError(fieldId);
      });
    }
  });

 // Submit do formulário
if (orcamentoForm) {
  orcamentoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      const inputNome = document.getElementById("nome").value;
      const inputServico = document.getElementById("servico").value;
      const inputDescricao = document.getElementById("mensagem").value;

      const mensagem = `Olá! Gostaria de um orçamento, meu nome é ${inputNome} e eu gostaria de um orçamento para ${inputServico}, a descrição do meu pedido é: ${inputDescricao}`;

      const linkWhatsApp = `https://wa.me/5519989190060?text=${encodeURIComponent(
        mensagem
      )}`;

      var submitBtn = document.getElementById("submitBtn");
      var originalText = submitBtn.innerHTML;

      // Estado de loading
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      // Aguarda 2 segundos antes de abrir o WhatsApp
      setTimeout(function () {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Limpa formulário
        orcamentoForm.reset();

        // Abre WhatsApp
        window.open(linkWhatsApp, "_blank");
      }, 2000);
    } else {
      // Scroll suave para o primeiro campo com erro
      var firstError = orcamentoForm.querySelector(".error");

      if (firstError) {
        var errorRect = firstError.getBoundingClientRect();
        var errorY =
          errorRect.top +
          window.pageYOffset -
          (header ? header.offsetHeight : 76) -
          30;

        smoothScrollTo(errorY, 500);
        firstError.focus();
      }
    }
  });
}

  // ============================================
  // SCROLL EVENT HANDLER (Otimizado com throttle)
  // ============================================
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleHeaderScroll();
        highlightActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // ============================================
  // INICIALIZAÇÃO
  // ============================================
  handleHeaderScroll();
  highlightActiveNav();

  // Animar elementos já visíveis no carregamento
  setTimeout(function () {
    animateElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("animated");
      }
    });
  }, 100);

  // ============================================
  // EFEITO PARALLAX SUAVE NOS SHAPES DO HERO
  // ============================================
  var heroShapes = document.querySelectorAll(".shape");

  window.addEventListener(
    "mousemove",
    function (e) {
      if (window.innerWidth < 768) return;

      var mouseX = e.clientX / window.innerWidth - 0.5;
      var mouseY = e.clientY / window.innerHeight - 0.5;

      heroShapes.forEach(function (shape, index) {
        var speed = (index + 1) * 8;
        var x = mouseX * speed;
        var y = mouseY * speed;
        shape.style.transform = "translate(" + x + "px, " + y + "px)";
      });
    },
    { passive: true },
  );

  // ============================================
  // SCROLL SUAVE AO CARREGAR COM HASH NA URL
  // Se a página for carregada com #secao na URL,
  // rola suavemente até ela após o carregamento
  // ============================================
  if (window.location.hash) {
    // Aguarda o carregamento completo antes de rolar
    setTimeout(function () {
      var hash = window.location.hash;
      var target = document.querySelector(hash);
      if (target) {
        // Primeiro vai pro topo sem animação
        window.scrollTo(0, 0);
        // Depois rola suavemente até o destino
        setTimeout(function () {
          scrollToSection(hash);
        }, 100);
      }
    }, 200);
  }
});
