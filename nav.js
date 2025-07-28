let navbar = `
 <nav class="navegacion">
    <h3>
    <a href="./" id="english">en</a> /
    <a href="./" id="espanol">es</a>
    </h3>
    <h3><a href="/">home</a></h3>
    <h3><a href="/info">info</a></h3>
    <h3><a href="/info" data-i18n="projects"></a></h3>
    </nav>
`;

let divLeftMenu = document.getElementById('divLeftMenu');

divLeftMenu.insertAdjacentHTML('afterbegin', navbar);