document.addEventListener('DOMContentLoaded', () => {
    // Récupération du formulaire de recherche et du tableau de résultats
    const form = document.getElementById('search-form');
    const table = document.getElementById('results');
  
    // Gestionnaire d'événement de soumission du formulaire
    form.addEventListener('submit', (event) => {
      // Empêche la soumission du formulaire
      event.preventDefault();
  
      // Récupération des mots-clés de recherche
      const keywords = form.elements.keywords.value;
  
      // Envoi de la requête en arrière-plan
      fetch(`/search?keywords=${keywords}`)
        .then((response) => response.json())
        .then((data) => {
          // Effacement des résultats précédents
          while (table.firstChild) {
            table.removeChild(table.firstChild);
          }
  
          // Ajout des nouveaux résultats
          data.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.nom}</td>
              <td>${item.prenom}</td>
            `;
            table.appendChild(row);
          });
        })
    });
})

var API_KEY = window.key;
var API_URL = 'https://2.intelx.io/';

$(document).on('click', '#btnSearch', function (event) {
    event.preventDefault();

    if ($('#searchField').val() == '') {
        return;
    }
    $('#searchResults').html('<p>Searching for results...</p>');

    $.ajax({
        url: API_URL + "intelligent/search",
        headers: { 'x-key': API_KEY },
        type: 'POST',
        cache: true,
        data: JSON.stringify({
            term: $('#searchField').val(),
            maxresults: 1000,
            media: 0,
            timeout: 1000,
            datefrom:"",
            dateto:"",
            lookuplevel: 0,
            sort: 2,
            terminate: []
        }),
        success: function (p, statusText, xhr) {
            $.ajax({
                url: API_URL + "intelligent/search/result",
                headers: { 'x-key': API_KEY },
                type: 'GET',
                cache: true,
                data: "id=" + p.id + "&limit=10&statistics=1&previewlines=8",
                success: function (data, textStatus, xhr) {
                    $('#searchResults').html("");
                    if (!!data && data.records.length > 0) {
                        var html = '<table class="table"><thead><tr><th>Date</th><th>Name</th><th>Preview</th><tbody id="result_public">'
                        $.each(data.records, function (i, record) {
                            html += "<tr>"
                                + "<td>" + record['date'].substr(0,10) + "</td>"
                                +"<td><a href='https://intelx.io/?did=" + record['systemid'] + "' target='_blank'>Full Data</a></td>"
                                +"<td>" + record['name'] + "</td>"
                                +"</tr>"
                        });
                        html += "</tbody></table>";
                        $('#searchResults').append(html)
                    } else {
                        $('#searchResults').html('<p>Nothing found :(</p>');
                    }
                }
            });
        }
    });
});