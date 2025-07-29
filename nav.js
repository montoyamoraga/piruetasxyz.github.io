let navbar = `
 <nav class="navegacion">
    <h1>
    <a href="./" id="english">en</a> /
    <a href="./" id="espanol">es</a>
    </h1>
    <h1><a href="/">home</a></h1>
    <h1><a href="/store" data-i18n="store"></a></h1>
    <h1><a href="/info">info</a></h1>
    <h1><a href="/people" data-i18n="people"></a></h1>
    <h1 data-i18n="projects"></h1>
    <h3>software</h3>
    <ol>
        <li>
            <a href="/projects/maquinitas-tidal" data-i18n="projects-maquinitas-tidal">
            </a>
        </li>
    </ol>
    <h3>hardware</h3>
    <ol>
        <li>
            <a href="/projects/gerassic-organ" data-i18n="projects-gerassic-organ">
            </a>
        </li>
    </ol>
    <h3>teaching</h3>
    </nav>
`;

let divLeftMenu = document.getElementById('divLeftMenu');

divLeftMenu.insertAdjacentHTML('afterbegin', navbar);