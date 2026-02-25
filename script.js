const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const form = document.querySelector('#contact-form');
const modal = document.querySelector('#form-modal');
const modalClose = document.querySelector('#modal-close');

const revealTargets = document.querySelectorAll(
  '.hero-text, .hero-visual, .about-text, .about-media figure, .about-stats, .section-title, .service-card, .convenio-logo, .team-grid article, .testimonial-card, .contact-info, .contact-form'
);

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const openModal = () => {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
};

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const endpoint = form.getAttribute('action');
    if (!endpoint || endpoint === '#') {
      openModal();
      form.reset();
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
        openModal();
      } else {
        alert('Nao foi possivel enviar no momento. Tente novamente.');
      }
    } catch (error) {
      alert('Nao foi possivel enviar no momento. Tente novamente.');
    }
  });
}

const addStagger = (containerSelector, itemSelector) => {
  document.querySelectorAll(containerSelector).forEach((container) => {
    const items = container.querySelectorAll(itemSelector);
    items.forEach((item, index) => {
      item.classList.add('js-reveal');
      item.style.transitionDelay = `${Math.min(index * 0.12, 0.48)}s`;
    });
  });
};

const applyReveal = () => {
  revealTargets.forEach((el) => {
    el.classList.add('js-reveal');
  });

  addStagger('.services-grid', '.service-card');
  addStagger('.team-grid', 'article');
  addStagger('.testimonial-grid', '.testimonial-card');
  addStagger('.convenio-grid', '.convenio-logo');

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((el) => observer.observe(el));
};

applyReveal();