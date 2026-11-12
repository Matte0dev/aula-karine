document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. ROLAGEM SUAVE
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (event) {

            const destino = document.querySelector(
                this.getAttribute("href")
            );

            if (destino) {
                event.preventDefault();

                destino.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });


    // =====================================
    // 2. PESQUISA DE ESPECIALIDADES E EXAMES
    // =====================================

    const secoesBusca = [
        document.querySelector("#especialidades"),
        document.querySelector("#exames")
    ];

    secoesBusca.forEach(secao => {

        if (!secao) return;

        const tabela = secao.querySelector("table");

        if (!tabela) return;

        const campoBusca = document.createElement("input");

        campoBusca.type = "search";
        campoBusca.placeholder = "Pesquisar...";
        campoBusca.setAttribute("aria-label", "Pesquisar nesta tabela");

        campoBusca.style.cssText = `
            width: 100%;
            padding: 14px;
            margin: 20px 0;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 15px;
        `;

        secao.insertBefore(campoBusca, tabela);

        campoBusca.addEventListener("input", function () {

            const pesquisa = this.value.toLowerCase();

            secao.querySelectorAll("tbody tr").forEach(linha => {

                linha.style.display =
                    linha.textContent.toLowerCase().includes(pesquisa)
                    ? ""
                    : "none";

            });
        });
    });


    // =====================================
    // 3. ATUALIZAÇÃO DO ANO
    // =====================================

    const rodape = document.querySelector("footer p:nth-child(2)");

    if (rodape) {
        rodape.innerHTML =
            `&copy; ${new Date().getFullYear()} Clínica. Todos os direitos reservados.`;
    }


    // =====================================
    // 4. GRÁFICO CANVAS
    // =====================================

    const canvas = document.getElementById("graficoServicos");

    if (canvas && canvas.getContext) {

        const ctx = canvas.getContext("2d");

        const dados = [
            { nome: "Especialidades", valor: 21, cor: "#102b4e" },
            { nome: "Exames", valor: 15, cor: "#d92332" }
        ];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#102b4e";
        ctx.font = "bold 20px Arial";
        ctx.fillText("Serviços cadastrados", 30, 35);

        dados.forEach((item, indice) => {

            const y = 85 + indice * 95;
            const largura = item.valor * 18;

            ctx.fillStyle = "#dce4ed";
            ctx.fillRect(30, y, 450, 30);

            ctx.fillStyle = item.cor;
            ctx.fillRect(30, y, largura, 30);

            ctx.fillStyle = "#102b4e";
            ctx.font = "bold 15px Arial";
            ctx.fillText(item.nome, 30, y - 12);
            ctx.fillText(item.valor, largura + 42, y + 21);
        });

        ctx.fillStyle = "#64748b";
        ctx.font = "13px Arial";
        ctx.fillText(
            "Total de opções disponíveis no catálogo",
            30,
            280
        );
    }


    // =====================================
    // 5. FORMULÁRIO DE AGENDAMENTO
    // =====================================

    const form = document.getElementById("formAgendamento");

    if (form) {

        const campoTelefone = document.getElementById("telefone");
        const campoData = document.getElementById("data");
        const feedback = document.getElementById("feedbackAgendamento");

        // Máscara do telefone e bloqueio de letras

        campoTelefone.addEventListener("input", function () {

            let numeros = this.value.replace(/\D/g, "").slice(0, 11);

            if (numeros.length > 7) {
                this.value = numeros.replace(
                    /^(\d{2})(\d{5})(\d{0,4})$/,
                    "($1) $2-$3"
                );
            } else if (numeros.length > 2) {
                this.value = numeros.replace(
                    /^(\d{2})(\d{0,5})$/,
                    "($1) $2"
                );
            } else if (numeros.length > 0) {
                this.value = "(" + numeros;
            }
        });

        // Bloqueia datas anteriores ao dia atual

        const hoje = new Date();

        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");

        campoData.min = `${ano}-${mes}-${dia}`;

        // Envio do formulário

        form.addEventListener("submit", function (event) {

            event.preventDefault();

            feedback.className = "";
            feedback.textContent = "";

            if (!form.checkValidity()) {
                form.reportValidity();

                feedback.textContent =
                    "Confira os campos e preencha as informações corretamente.";

                feedback.className = "erro";
                return;
            }

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const telefone = campoTelefone.value;
            const especialidade = document.getElementById("especialidade").value;
            const data = campoData.value;
            const mensagem = document.getElementById("mensagem").value.trim();

            // SUBSTITUA PELO WHATSAPP OFICIAL DA CLÍNICA

            const numeroClinica = "5583999999999";

            const texto =
                `Olá! Gostaria de solicitar um agendamento.\n\n` +
                `Nome: ${nome}\n` +
                `E-mail: ${email}\n` +
                `Telefone: ${telefone}\n` +
                `Especialidade: ${especialidade}\n` +
                `Data desejada: ${data}\n` +
                `Mensagem: ${mensagem}`;

            const linkWhatsApp =
                `https://wa.me/${numeroClinica}?text=${encodeURIComponent(texto)}`;

            feedback.textContent =
                "Dados preenchidos! Abrindo o WhatsApp para continuar.";

            feedback.className = "sucesso";

            window.open(linkWhatsApp, "_blank");
        });
    }

});