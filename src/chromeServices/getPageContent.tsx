export function getPageContent() {
    return document.documentElement.innerText;
}

export function highlightDOM(param: any) {
    // insert specific highlight css style
    const sheet = new CSSStyleSheet();
    sheet.insertRule(".opcti-highlight {background: rgb(15, 188, 255); color: black; border: 1px solid rgb(15, 188, 255);}");
    document.adoptedStyleSheets = [sheet];
    const observables = param.observables.map((obj: any) => escapeRegExp(obj.original));
    processNode(document.body, observables);
}

function appendStyle(node: any, content: any){
    let parentNode = node.parentNode;
    if (parentNode) {
        // Replace concrete text node in parent with the IoC HTML contents
        let span = document.createElement('span');
        parentNode.insertBefore(span, node);
        parentNode.removeChild(node);
        span.outerHTML = content;
    }
    return node;
}

function matchedObservable(matched: string){
    return '<span class=opcti-highlight>' + matched + '</span>';
}

function escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function processNode(node: any, observables: any[]){
    let contentRegex = observables.join('|')
    let regex = RegExp("("+contentRegex+")", "g")
    if (!node.firstChild) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.match(regex)) {
                let newTextContent = node.textContent.replaceAll(regex, function(matched: string) {
                    return matchedObservable(matched);
                });
                node = appendStyle(node, newTextContent);
            }
        }
    }
    node = node.firstChild;
    while (node) {
        let nextSibling = node.nextSibling;
        processNode(node, observables);
        node = nextSibling;
    }
}


