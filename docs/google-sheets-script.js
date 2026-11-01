

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    if (sheet.getLastRow() === 0) {
      var headers = [
        "Data/Hora",
        "Nome",
        "Sobrenome",
        "E-mail",
        "Telefone / WhatsApp",
        "CEP",
        "Logradouro / Rua",
        "Número",
        "Complemento",
        "Bairro",
        "Cidade",
        "UF",
        "Mensagem / Observações"
      ];
      sheet.appendRow(headers);

      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#15803d"); 
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    var row = [
      data.dataHoraFormatada || new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      data.nome || "",
      data.sobrenome || "",
      data.email || "",
      data.telefone || "",
      data.cep || "",
      data.rua || "",
      data.numero || "",
      data.complemento || "",
      data.bairro || "",
      data.cidade || "",
      data.uf || "",
      data.mensagem || ""
    ];

    sheet.appendRow(row);

    for (var col = 1; col <= 13; col++) {
      sheet.autoResizeColumn(col);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead registrado com sucesso!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testarGravacao() {
  var eventoSimulado = {
    postData: {
      contents: JSON.stringify({
        dataHoraFormatada: new Date().toLocaleString("pt-BR"),
        nome: "Lucas",
        sobrenome: "Sales",
        email: "lucas.sales@exemplo.com",
        telefone: "(11) 98765-4321",
        cep: "01001-000",
        rua: "Praça da Sé",
        numero: "500",
        complemento: "Bloco B",
        bairro: "Sé",
        cidade: "São Paulo",
        uf: "SP",
        mensagem: "Teste de envio de lead para a planilha do Google Sheets!"
      })
    }
  };
  doPost(eventoSimulado);
}
