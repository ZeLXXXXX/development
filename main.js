document.addEventListener('DOMContentLoaded', function () {
  (function initNav() {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
      });
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  (function initAuthForms() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const switchLinks = document.querySelectorAll('.switch-link');

    if (!authTabs.length && !authForms.length) return;

    function setAuthMode(mode) {
      authTabs.forEach(function (tab) {
        const isActive = tab.getAttribute('data-auth') === mode;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      authForms.forEach(function (form) {
        const isActive = form.getAttribute('data-auth') === mode;
        form.classList.toggle('is-active', isActive);
      });
    }

    authTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        setAuthMode(tab.getAttribute('data-auth'));
      });
    });

    switchLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        setAuthMode(link.getAttribute('data-target'));
      });
    });
  })();

  (function initRoleSelector() {
    const roleDashboard = document.querySelector('.role-dashboard');
    if (!roleDashboard) return;

    const roleData = {
      admin: {
        title: 'Admin',
        badge: 'Active',
        access: 'Full system control',
        description: 'Full administrative access to maintain infrastructure, manage user permissions, and monitor critical system events in real time.',
        metrics: { nodes: '128', events: '24', sessions: '19' },
        permissions: [
          { label: 'Server provisioning', status: 'granted' },
          { label: 'Incident response', status: 'granted' },
          { label: 'User role control', status: 'granted' },
          { label: 'Audit logs', status: 'granted' },
          { label: 'SSO configuration', status: 'limited' },
          { label: 'System shutdown', status: 'granted' }
        ]
      },
      super: {
        title: 'Super',
        badge: 'Monitoring',
        access: 'Operational oversight',
        description: 'Supervisor-level access focused on resource oversight, health checks, and rapid response coordination across multiple environments.',
        metrics: { nodes: '82', events: '18', sessions: '12' },
        permissions: [
          { label: 'Server health', status: 'granted' },
          { label: 'Deployment approvals', status: 'granted' },
          { label: 'Support escalation', status: 'granted' },
          { label: 'Alert response', status: 'limited' },
          { label: 'User management', status: 'limited' },
          { label: 'System reboot', status: 'blocked' }
        ]
      },
      user: {
        title: 'User',
        badge: 'Restricted',
        access: 'Personal workspace access',
        description: 'Standard access for operating assigned tasks, monitoring personal dashboards, and submitting service requests without system-level controls.',
        metrics: { nodes: '12', events: '5', sessions: '3' },
        permissions: [
          { label: 'Dashboard access', status: 'granted' },
          { label: 'Task submission', status: 'granted' },
          { label: 'Profile settings', status: 'granted' },
          { label: 'Project view', status: 'limited' },
          { label: 'System config', status: 'blocked' },
          { label: 'Admin actions', status: 'blocked' }
        ]
      }
    };

    const roleTitle = document.getElementById('role-title');
    const roleStatusPill = document.getElementById('role-status-pill');
    const roleDescription = document.getElementById('role-description');
    const roleAccess = document.getElementById('role-access');
    const permissionsList = document.getElementById('permission-list');
    const permissionCount = document.getElementById('permission-count');
    const metricFields = document.querySelectorAll('[data-metric]');
    const buttons = document.querySelectorAll('.role-btn');

    function renderRole(roleKey) {
      const role = roleData[roleKey];
      if (!role || !roleTitle || !roleStatusPill || !roleDescription || !roleAccess || !permissionsList || !permissionCount) return;

      roleTitle.textContent = role.title;
      roleStatusPill.textContent = role.badge;
      roleStatusPill.style.borderColor = roleKey === 'admin' ? 'rgba(46, 204, 113, 0.46)' : roleKey === 'super' ? 'rgba(241, 196, 15, 0.46)' : 'rgba(148, 163, 184, 0.4)';
      roleStatusPill.style.background = roleKey === 'admin' ? 'rgba(46, 204, 113, 0.12)' : roleKey === 'super' ? 'rgba(241, 196, 15, 0.12)' : 'rgba(148, 163, 184, 0.12)';
      roleStatusPill.style.color = roleKey === 'admin' ? 'var(--green-400)' : roleKey === 'super' ? 'var(--yellow-400)' : 'var(--slate-200)';

      roleDescription.textContent = role.description;
      roleAccess.textContent = role.access;

      metricFields.forEach(function (field) {
        const metricKey = field.getAttribute('data-metric');
        if (role.metrics[metricKey]) {
          field.textContent = role.metrics[metricKey];
        }
      });

      const enabledCount = role.permissions.filter(function (item) {
        return item.status === 'granted' || item.status === 'limited';
      }).length;
      permissionCount.textContent = enabledCount + ' enabled';

      permissionsList.innerHTML = role.permissions.map(function (item) {
        return [
          '<div class="permission-item">',
          '  <span>' + item.label + '</span>',
          '  <span class="permission-status ' + item.status + '">' + (item.status === 'granted' ? 'Allowed' : item.status === 'limited' ? 'Limited' : 'Blocked') + '</span>',
          '</div>'
        ].join('');
      }).join('');

      buttons.forEach(function (button) {
        const isActive = button.getAttribute('data-role') === roleKey;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        renderRole(button.getAttribute('data-role'));
      });
    });

    renderRole('admin');
  })();
});
