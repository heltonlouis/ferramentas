document.querySelectorAll("nav ul li a").forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

// Verifica se o usuário já está logado
const users = JSON.parse(localStorage.getItem("users")) || [];
var userLogedIn = {};

function verifyUser() {
  if (users.length > 0 && users[0].name && users[0].phone) {
    // Usuário já está logado, redireciona para a tela de início
    userLogedIn = users[0];
    const hello = document.querySelector(".hello");
    hello.innerHTML =
      `Ola, <a onclick="loginLocal()" class="link-active" title="Se não for você, clique aqui!">` +
      `${userLogedIn.name}!</a> seja bem-vindo(a).`;
  } else {
    // Usuário não está logado, exibe o SweetAlert para login
    showLoginPrompt();
  }

  // Inicia o carrossel
  startCarousel();
}
verifyUser();

function loginLocal() {
  showLoginPrompt();
}

function showLoginPrompt() {
  Swal.fire({
    title: "Login",
    html: `
      <p></p>Por favor, insira seu nome e telefone:</p>
      <input id="nome" class="swal2-input" placeholder="Nome">
      <input id="telefone" class="swal2-input" placeholder="Telefone">
    `,
    confirmButtonText: "Entrar",
    showCancelButton: users.length > 0 ? true : false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
      const name = document.getElementById("nome").value;
      const phone = document.getElementById("telefone").value;
      if (name && phone) {
        console.log(name, phone);
        if (users.length > 0) {
          const existe = users.some((user) => user.phone === phone);
          if (existe) {
            const index = users.findIndex((user) => user.phone === phone);
            const usuario = users.find((user) => user.phone === phone);
            if (index !== -1) {
              userLogedIn = usuario;
              users.splice(index, 1);
              users.unshift(usuario);
              localStorage.setItem("users", JSON.stringify(users));
              window.location.reload();
            }
          } else {
            const user = { name, phone };
            console.log(user);
            userLogedIn = user;
            users.unshift(user);
            localStorage.setItem("users", JSON.stringify(users));
            window.location.reload();
          }
        } else {
          const user = { name, phone };
          console.log(user);
          userLogedIn = user;
          users.unshift(user);
          localStorage.setItem("users", JSON.stringify(users));
          window.location.reload();
        }
      } else {
        Swal.fire({
          title: "Erro",
          text: "Por favor, insira ambos os campos.",
          icon: "error",
        }).then(() => {
          showLoginPrompt();
        });
      }
    }
  });

  document.getElementById("telefone").addEventListener("input", function (e) {
    let input = e.target;
    let value = input.value.replace(/\D/g, ""); // Remove tudo que não é dígito

    // Limita o valor a 11 dígitos
    if (value.length > 11) value = value.slice(0, 11);

    // Formata o valor de acordo com a máscara
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    input.value = value;
  });
}

function startCarousel() {
  let currentIndex = 0;
  const images = document.querySelectorAll(".carousel img");
  const indicators = document.querySelectorAll(".carousel-indicators span");
  const totalImages = images.length;

  function showImage(index) {
    images[currentIndex]?.classList.remove("active");
    indicators[currentIndex]?.classList.remove("active");
    currentIndex = index;
    images[currentIndex]?.classList.add("active");
    indicators[currentIndex]?.classList.add("active");
  }

  function showNextImage() {
    const nextIndex = (currentIndex + 1) % totalImages;
    showImage(nextIndex);
  }

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      const index = parseInt(indicator.getAttribute("data-index"));
      showImage(index);
    });
  });

  setInterval(showNextImage, 3000);
}
