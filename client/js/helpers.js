// check whether an element isn't visible on page
export function isHidden(elem) {
    const style = window.getComputedStyle(elem);
    return (style.display === 'none')
}