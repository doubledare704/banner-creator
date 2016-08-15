function CreateProjectClick(e) {
    e.preventDefault();
    const menuItem = e.target.parentElement;
    const form = menuItem.nextElementSibling;
    menuItem.classList.add('hidden');
    form.classList.remove('hidden');
}

export default function handleCreateProjectClick(node) {
    node.onclick = CreateProjectClick;
}

