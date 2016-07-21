const deleteBtn = document.getElementById('delete-btn');
// `url_for/${var}`  // need to return to <int :img_id> // do the same with the rename func
deleteBtn.addEventListener('click', function() {
    fetch("/delete/", {
        method:"POST",
        headers: {
                'Content-Type': 'application/json'
        },
    body: JSON.stringify({id:46})
    }).then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
        // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
        });
    });