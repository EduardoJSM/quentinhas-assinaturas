document.addEventListener("DOMContentLoaded", () => {
  const salvar = document.getElementById("salvar");
  const buscar = document.getElementById("buscar");
  const resultado = document.getElementById("resultado");

  salvar.addEventListener("click", () => {
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const cargo = document.getElementById("cargo").value.trim();
    const assinatura = document.getElementById("assinatura").value.trim();

    if (!nome || !cpf || !assinatura) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dados = { nome, cpf, cargo, assinatura };
    localStorage.setItem(cpf, JSON.stringify(dados));
    alert("Assinatura salva com sucesso!");
  });

  buscar.addEventListener("click", () => {
    const cpfBusca = document.getElementById("cpfBusca").value.trim();
    const dados = localStorage.getItem(cpfBusca);

    if (dados) {
      const perfil = JSON.parse(dados);
      resultado.style.display = "block";
      resultado.innerHTML = `
        <p><strong>Nome:</strong> ${perfil.nome}</p>
        <p><strong>Cargo:</strong> ${perfil.cargo}</p>
        <p><strong>Assinatura:</strong></p>
        <div style="font-family: 'Brush Script MT', cursive; font-size: 1.4rem;">${perfil.assinatura}</div>
      `;
    } else {
      resultado.style.display = "block";
      resultado.innerHTML = "<p>Assinatura não encontrada para este CPF.</p>";
    }
  });
});
