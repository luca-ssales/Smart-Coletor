
window.KNOWLEDGE = {
  suggestions: [
    "Como funciona o sensor?",
    "Qual é a função do Arduino?",
    "Para que servem os LEDs?",
    "O que torna essa lixeira inteligente?",
    "Como esse projeto pode ajudar no dia a dia?"
  ],

  welcome: "Olá! Seja bem-vindo ao nosso projeto. Quer saber como funciona a lixeira inteligente? Posso explicar o sensor, o Arduino, os LEDs e as possibilidades dessa ideia. Escolha uma pergunta ou escreva sua dúvida.",

  fallback: "Não encontrei essa informação no conteúdo do projeto. Posso explicar o sensor, o Arduino, os LEDs, os componentes ou como essa ideia pode ser aplicada.",

  topics: [
    {
      id: "sensor",
      keywords: ["como funciona o sensor", "funciona o sensor", "sensor", "hc-sr04", "hcsr04", "ultrassonico", "ultrassom", "eco", "echo", "trig", "mede", "medir", "medicao", "distancia"],
      answer: "O sensor HC-SR04 fica na parte de cima da lixeira, apontado para dentro. Ele envia um som que não conseguimos ouvir e espera o eco voltar. Quanto mais demora, mais longe estão os resíduos. É assim que ele mede a distância."
    },
    {
      id: "arduino",
      keywords: ["arduino", "microcontrolador", "placa", "funcao do arduino", "programacao", "programa", "codigo"],
      answer: "O Arduino é o “cérebro” do protótipo. Ele recebe a medida do sensor, usa essa informação para estimar o quanto a lixeira está ocupada e controla os LEDs de acordo com o nível."
    },
    {
      id: "leds",
      keywords: ["led", "leds", "luz", "luzes", "cor", "cores", "sinal", "sinais", "sinalizacao", "indicador", "indicadores", "acendem"],
      answer: "Os LEDs mostram o nível da lixeira sem precisar abrir a tampa. São quatro: verde para nível baixo, amarelo para intermediário, laranja para elevado e vermelho para crítico, quando a lixeira está perto da capacidade máxima."
    },
    {
      id: "inteligente",
      keywords: ["o que torna", "torna", "inteligente", "inteligencia", "diferente", "diferencial", "automatica", "automacao"],
      answer: "O que a torna inteligente é que ela percebe sozinha o quanto está cheia. Ninguém precisa abrir a tampa para conferir: o sensor mede, o Arduino interpreta a medida e os LEDs avisam."
    },
    {
      id: "nivel",
      keywords: ["cheia", "cheio", "identifica", "identificar", "detecta", "detectar", "nivel", "niveis", "preenchimento", "calcula", "calculo", "faixa", "faixas", "limite", "limites", "porcentagem"],
      answer: "O Arduino compara a distância medida com a distância da lixeira vazia. Quanto menor a distância até os resíduos, mais cheia ela está. Esse resultado cai em um dos quatro níveis e o LED correspondente acende.\nAs faixas de porcentagem mostradas no site são ilustrativas."
    },
    {
      id: "componentes",
      keywords: ["componente", "componentes", "material", "materiais", "peca", "pecas", "utilizado", "utilizados", "usamos", "usado", "usados", "jumper", "jumpers", "fio", "fios", "estrutura"],
      answer: "Usamos cinco itens: o Arduino, o sensor ultrassônico HC-SR04, os LEDs indicadores, a estrutura da lixeira e os jumpers para conectar tudo."
    },
    {
      id: "beneficios",
      keywords: ["ajudar", "ajuda", "dia a dia", "beneficio", "beneficios", "vantagem", "vantagens", "utilidade", "importancia", "aplicacao", "aplicacoes", "objetivo", "proposito"],
      answer: "Ela ajuda a perceber quando uma lixeira está ficando cheia, o que evita deixá-la transbordar. Em uma aplicação futura, essa informação também poderia ajudar a organizar melhor a coleta. Para nós, o projeto também foi uma forma de aplicar automação na prática."
    },
    {
      id: "futuro",
      keywords: ["internet", "wifi", "wi-fi", "nuvem", "app", "aplicativo", "limitacao", "limitacoes", "futuro", "futuras", "evolucao", "evoluir", "melhorar", "prefeitura", "municipal", "iot", "conectada"],
      answer: "Nosso protótipo sinaliza o nível apenas com LEDs, no próprio local. Monitoramento pela internet e integração com sistemas de coleta são possibilidades para versões futuras, mas ainda não foram implementados."
    },
    {
      id: "simulador",
      keywords: ["simulador", "simulacao", "simulado", "simulados", "demonstracao", "dados", "real", "ao vivo"],
      answer: "O simulador do site serve só para demonstrar a ideia. Os valores de nível, distância e status são calculados no navegador e não vêm de uma lixeira conectada."
    },
    {
      id: "alcance",
      keywords: ["alcance", "precisao", "centimetros", "tensao", "5v", "alimentacao", "especificacao", "especificacoes"],
      answer: "De forma geral, o HC-SR04 funciona com 5 V e mede distâncias de cerca de 2 cm a 400 cm. Esses são valores típicos de datasheet. Detalhes de montagem do nosso protótipo não estão no conteúdo do site."
    },
    {
      id: "saudacao",
      keywords: ["ola", "oi", "bom dia", "boa tarde", "boa noite", "e ai", "tudo bem", "ajuda por favor"],
      answer: "Olá! Pode perguntar sobre o sensor, o Arduino, os LEDs, os componentes ou como a ideia pode ser aplicada."
    },
    {
      id: "projeto",
      keywords: ["projeto", "lixeira", "o que e", "sobre", "resumo", "funciona", "funcionamento", "como funciona"],
      answer: "É um protótipo de lixeira que identifica o nível de resíduos em seu interior. O sensor mede a distância até o lixo, o Arduino estima o quanto está ocupado e os LEDs mostram a situação."
    },
    {
      id: "empresa",
      keywords: ["quem somos", "empresa", "smart coleta", "smart coletor", "sobre a empresa", "institucional", "missao"],
      answer: "A Smart Coleta Tecnologia Ltda. é uma iniciativa focada em utilizar automação e IoT para tornar a gestão e coleta de resíduos mais inteligente, eficiente e sustentável."
    },
    {
      id: "historia",
      keywords: ["historia", "historico", "como nasceu", "origem", "fundacao", "trajetoria", "2026"],
      answer: "A Smart Coleta nasceu em 2026 para resolver a ineficiência da verificação manual de lixeiras, desenvolvendo lixeiras inteligentes com sensores e automação. Atualmente, estamos validando protótipos para condomínios, escolas e empresas."
    }
  ]
};
