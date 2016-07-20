const deleteBtn = document.getElementsById('upload');
const result = document.querySelectorAll('[data-header-image-array]');
// deleteBtn.addEventListener('click', function(){
//     console.log('loaded');
//     const data = {id: this.props.id};
//     fetch(
//         '/delete',
//         {
//             metod: 'post',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//         .then((res) => res.json())
//         .then(({image_json})=> result.setAttribute("data-header-image-array", "{image_json}"))
// });


deleteBtn.addEventListener('click', function(){
    console.log('loaded');
});