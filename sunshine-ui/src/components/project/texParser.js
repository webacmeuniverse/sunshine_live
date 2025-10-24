import parseTex from 'texjs-parser';

import parseSpecialSymbols from '../../utils/parseSpecialSymbols';

// Below RegExp is used to fix columned LaTex content, which
// is parseds well by the Tex compileer, but frontend library
// joins the words after each new line. That's why am extra
// blank space needs to be added to fix the issue.
// eslint-disable-next-line max-len
const utf8Chars = 'A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC';
const utf8CharsRE = new RegExp(`([${utf8Chars}])\n`, 'g');

export function parse(texString) {
  // Replace tabs after the control word item so that
  // the parser won't process as two separate entries.
  // Replace new lines only in middle of sentences so
  // that `parseTex` won't join words from next line.
  const trimmedString = texString
    .replace(/item\t/g, 'item ')
    .replace(/\\circ C/g, '°C')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\times/g, '×')
    .replace(/%\s?(chktex \d+\s?)+/g, '')
    .replace(/\{(\D{1})\}/g, '$1')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\par/g, '')
    .replace(/\\topskip\dpt/g, '')
    .replace(/\\renewcommand.*\}/g, '')
    .replace(/<no value>\s?/g, '')
    .replace(/`\\hline`/g, '')
    .replace(/\]\n?\s?% table: (.*)/g, ']\n\n% table: $1')
    .replace(utf8CharsRE, '$1 \n');

  const rawArr = parseTex(trimmedString);
  for (const i in rawArr) {
    const node = rawArr[i];
    if (typeof node === 'string') {
      continue;
    }
    if (node.name !== 'document') {
      continue;
    }

    const rootNode = { kind: 'document', children: [] };
    appendNodes(node.children, rootNode);

    return mapPages(rootNode);
  }

  return [];
}

const kindTagsMap = {
  itemize: 'ul',
  enumerate: 'ol',
  section: 'h2',
  subsection: 'ol',
  subsubsection: 'ol',
  text: { component: 'div', props: { className: 'inline-text' } },
  textB: 'strong',
  textInline: { component: 'div', props: { className: 'inline-text' } },
  vspace: { component: 'div', props: { className: 'br' } },
};

const kindTagsArr = Object.keys(kindTagsMap);

function itemToHTML(item) {
  const tag = { component: 'li', children: [] };
  for (const i in item.title) {
    const t = item.title[i];
    if (t.kind !== 'text') {
      tag.children.push(t);
      continue;
    }
    tag.children.push(t.value);
  }
  if (item.children.length > 0) {
    tag.children.push(toHTML(item.children));
  }

  return tag;
}

function tableToHTML(item) {
  const tag = { component: 'table', children: [], props: { className: 'epc-inline-table' } };

  if (item.headers) {
    tag.children.push({
      component: 'thead',
      children: [
        {
          component: 'tr',
          children: item.headers.map(h => ({
            component: 'th',
            children: [itemToHTMLTag(h)],
          })),
        }
      ],
    });
  }
  if (item.rows.length > 0) {
    tag.children.push({
      component: 'tbody',
      children: item.rows.map(r => ({
        component: 'tr',
        children: r.map(c => ({
          component: 'td',
          children: [itemToHTMLTag(c)],
        })),
      })),
    });
  }

  return tag;
}

export function toHTML(children) {
  const components = [];
  for (let i = 0; i < children.length; i++) {
    const item = children[i];

    if (kindTagsArr.indexOf(item.kind) > -1) {
      components.push(itemToHTMLTag(item));
      continue;
    }

    if (item.kind === 'text-component') {
      components.push(
        {
          component: item.tag,
          children: [
            { component: 'span', props: { dangerouslySetInnerHTML: { __html: item.value } } },
            ...toHTML(item.children || []),
          ],
        }
      );
    }

    if (item.kind === 'inline-instruction') {
      const instructionNodes = toHTML(item.children);
      components.push({
        component: 'h4',
        props: { className: 'annex-inline-instruction' },
        children: instructionNodes,
      });
      continue;
    }

    if (item.kind === 'item') {
      components.push(itemToHTML(item));
      continue;
    }

    if (item.kind === 'center') {
      toHTML(item.children).map(c => components.push(c));
      continue;
    }

    if (item.kind === 'inline-table') {
      components.push(tableToHTML(item));
    }

    if (item.kind === 'table') {
      components.push(item);
    }

    if (item.kind === 'instruction') {
      components.push(item);
    }

    if (item.kind === 'frac') {
      components.push({
        component: 'span',
        props: { className: 'annex-fraction-instruction' },
        children: item.children?.map(c => c.value),
      });
    }
  }

  return components;
}

function itemToHTMLTag(item) {
  if (typeof item === 'string') {
    return item;
  }

  const t = kindTagsMap[item.kind];
  if (!t) {
    return null;
  }
  const tag = {
    component: t.component || t,
    props: t.props || undefined,
    children: [],
  };

  if (item.title) {
    tag.children.push(item.title);
  }
  if (item.value) {
    tag.children.push(item.value);
  }
  if (item.children) {
    tag.children.push(toHTML(item.children));
  }
  return tag;
}

function mapPages(n) {
  const pages = [];
  let pageIDX = 0;

  const len = n.children.length;
  for (let i = 0; i < len; i++) {
    if (!pages[pageIDX]) {
      pages[pageIDX] = { title: null, content: [] };
    }

    const item = n.children[i];
    if (item.kind === 'pagebreak') {
      // If current page has no content, but we receive
      // `pagebreak` instruction - no need to create new
      // page entry - rather reuse the existing empty one.
      if (pages[pageIDX].title === null && pages[pageIDX].content.length < 1) {
        continue;
      }
      pageIDX++;
      continue;
    }

    if (item.kind === 'FloatBarrier') {
      continue;
    }

    if (item.kind === 'section' && !pages[pageIDX].title) {
      pages[pageIDX].title = item.title;
      continue;
    }

    if (!pages[pageIDX].title && pageIDX > 0) {
      delete pages[pageIDX];
      pageIDX--;
    }
    pages[pageIDX].content.push(item);
  }

  return pages;
}

// lastTableNode holds the value of `% table: [a-z]` annotation
// used to render dynamic backend tables. If such a table will
// be rendered, we don't want to display it twice.
let lastTableNode;

// eslint-disable-next-line max-statements, complexity
function appendNodes(nodes, root) {
  let workingNode;
  let inWorkingNode;
  let subsectionWorkingNode;
  let subSubSectionWorkingNode;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (['center', 'multicols'].indexOf(node.name) > -1) {
      const appendTo = workingNode || root;
      appendNodes(node.children, appendTo);
      continue;
    }

    // Check if current annotation will start parsing an inline
    // table. If this table has been already appended to the working
    // stack via the `kind: 'table'` - skip the parsing altogether.
    if (isTabuNode(node) && lastTableNode) {
      lastTableNode = null;
      continue;
    }

    const parsedNode = getNodeParsed(node);

    if (!parsedNode) {
      continue;
    }

    if (parsedNode.kind === 'pagebreak') {
      workingNode = null;
      subsectionWorkingNode = null;
      subSubSectionWorkingNode = null;
      lastTableNode = null;
      root.children.push(parsedNode);
      continue;
    }

    // If appending to a text workingNode, but incoming node is
    // not of text type - reset the working node logic.
    if (isTextNode(workingNode) && !isTextNode(parsedNode)) {
      workingNode = null;
    }

    if (parsedNode.kind === 'table') {
      lastTableNode = parsedNode.value;
    }

    // Check if should close the working node before proceeding
    // with any other computations.
    if (inWorkingNode && inWorkingNode.shouldClose) {
      // If current node is text, but is preceeded by command node -
      // remove the value string as values will be duplicated.
      if (parsedNode.value) {
        parsedNode.value = parsedNode.value.replace(inWorkingNode.value, '');

        if (!parsedNode.value) {
          continue;
        }
      }

      inWorkingNode = null;
    }

    if (node.name === 'section') {
      workingNode = null;
      subsectionWorkingNode = null;
      subSubSectionWorkingNode = null;
      lastTableNode = null;
      root.children.push(parsedNode);
      continue;
    }

    if (parsedNode.isSubsection) {
      workingNode = parsedNode;
      if (!subsectionWorkingNode) {
        subsectionWorkingNode = { kind: node.name, children: [parsedNode] };
        root.children.push(subsectionWorkingNode);
        continue;
      }

      if (parsedNode.subSubSection) {
        if (!subSubSectionWorkingNode) {
          subSubSectionWorkingNode = { kind: node.name, children: [parsedNode] };
          subsectionWorkingNode.children[0].children.push(subSubSectionWorkingNode);
          continue;
        }
        subSubSectionWorkingNode.children.push(parsedNode);
        continue;
      }
      subsectionWorkingNode.children.push(parsedNode);
      continue;
    }

    if (parsedNode.kind === 'item') {
      workingNode = { kind: 'item', title: null, children: parsedNode.children || [] };
      root.children.push(workingNode);

      continue;
    }

    if (parsedNode.kind === 'iffalse') {
      inWorkingNode = { kind: 'instruction', shouldClose: false, command: '', value: '', type: '' };
      continue;
    }

    if (parsedNode.kind === 'fi') {
      inWorkingNode.shouldClose = true;

      const childNode = workingNode?.children[workingNode.children.length - 1];
      if (childNode && !childNode.children) {
        childNode.children = [];
      }
      let appendTo;
      if (inWorkingNode.type === 'attachment') {
        appendTo = workingNode || root;
      } else {
        appendTo = childNode || workingNode || root;
      }

      if (appendTo.title) {
        appendTo.title.push(inWorkingNode);
        continue;
      }
      appendTo.children.push(inWorkingNode);
      continue;
    }

    // If `inWorkingNode` is instruction and current node
    // kind is text - this is the instruction's command.
    if (inWorkingNode?.kind === 'instruction') {
      // This should never happen, as an instruction TEX command
      // (marked by if-fi statements) should be always succeeded
      // by a text node.
      if (parsedNode.kind !== 'text') {
        console.warn(`TEX parse error: 'if-fi' block followed by non text node! ${parsedNode.kind}`); // eslint-disable-line no-console
        continue;
      }

      const command = parseCommand(parsedNode.value.trim());
      inWorkingNode.command = command.command;
      inWorkingNode.commandKind = command.kind;
      inWorkingNode.type = command.type;
      inWorkingNode.storeKey = command.storeKey;
      inWorkingNode.value = command.value;
      continue;
    }

    const appendTo = workingNode || root;
    // If no workingNode but if parsedNode IS `text` make it the working node
    // so that inline elements can stick together.
    if (!workingNode && parsedNode.kind === 'text') {
      workingNode = parsedNode;
    }

    if (appendTo.title && Array.isArray(appendTo.title)) {
      appendTo.title.push(parsedNode);
      continue;
    }

    // If workingNode is a text node - it has not been
    // interrupted by another non-text node - we need to
    // append the incoming text node to it as to not break
    // into multiple lines.
    if (appendTo.kind === 'text' && isTextNode(parsedNode)) {
      appendTo.children.push({
        kind: 'textInline',
        value: [':', ')'].indexOf(parsedNode.value[0]) > -1 ? parsedNode.value : ` ${parsedNode.value}`,
        children: parsedNode.children,
      });
      continue;
    }

    // If not appending to an 'item' node - no checks to make
    // further - just append to its children.
    if (appendTo.kind !== 'item') {
      appendTo.children.push(parsedNode);
      continue;
    }

    // If no last children items to append to - append to the
    // workingNode children themselves or if lastChild is
    // `inline-instruction` we don't want to append to its children, but
    // rather to its parent.
    const lastChild = appendTo.children[appendTo.children.length - 1];
    if (!lastChild?.children || lastChild.kind === 'inline-instruction') {
      appendTo.children.push(parsedNode);
      continue;
    }

    // If appending to a list item - no need for `text` node, which will
    // render as an additional `p` inside the `li` tag - use `span` instead.
    if (parsedNode.kind === 'text') {
      lastChild.children.push({
        kind: 'textInline',
        value: ` ${parsedNode.value}`,
        children: parsedNode.children,
      });
      continue;
    }

    // If the `parsedNode` is a 'text-component' make sure it renders
    // as a `span` instead of the default `p`.
    if (parsedNode.kind === 'text-component') {
      lastChild.children.push({
        ...parsedNode,
        value: ` ${parsedNode.value}`,
        tag: 'span',
      });
      continue;
    }

    appendTo.children.push(parsedNode);
    continue;
  }
}

const ignoreNodes = ['tabucline', 'rowfont', 'bfseries', 'mbox', 'vfill', 'url'];

function getNodeParsed(node) {
  if (typeof node === 'string') {
    return parseStringNode(node);
  }

  if (ignoreNodes.indexOf(node.name) > -1) {
    return null;
  }

  if (node.name === '%') {
    return {
      kind: 'textInline',
      value: '%',
    };
  }

  if (node.name === 'vspace') {
    return { kind: 'vspace' };
  }

  if (node.name === 'textbf') {
    return {
      kind: 'textInline',
      value: '',
      children: [
        {
          kind: 'textB',
          value: node.arguments[0].value,
        },
      ],
    };
  }

  if (isTabuNode(node)) {
    return tabuToTable(node);
  }

  if (node.name === 'frac' && node.arguments?.length > 0) {
    return {
      kind: 'frac',
      children: node.arguments,
    };
  }

  if (node.children) {
    const root = { kind: node.name, children: [] };
    appendNodes(node.children, root);
    return root;
  }

  if (node.name === 'section') {
    const title = node.arguments[0].value;
    if (title.match(/\$(.*?)\$/)) {
      return { kind: 'text-component', value: parseSpecialSymbols(title), tag: 'h4' };
    }

    return { kind: node.name, title };
  }

  if (node.name === 'subsection') {
    return {
      kind: 'item',
      isSubsection: true,
      children: [
        { kind: 'text-component', tag: 'h4', value: node.arguments[0].value },
        { kind: 'vspace'},
      ],
    };
  }

  if (node.name === 'subsubsection') {
    return {
      kind: 'item',
      isSubsection: true,
      subSubSection: true,
      children: [
        { kind: 'text-component', tag: 'h5', value: node.arguments[0].value },
        { kind: 'vspace'},
      ],
    };
  }

  if (node.arguments?.length > 0) {
    return parseArgumentsNode(node);
  }

  return { kind: node.name };
}

// parseArgumentsNode extracts node children from its
// `arguments` array, rather than its `children`.
function parseArgumentsNode(argNode) {
  const root = { kind: argNode.name || 'inline-instruction', title: null, children: [] };
  if (!argNode.arguments?.length) {
    return root;
  }

  const children = [];
  for (let i = 0; i < argNode.arguments.length; i++) {
    const n = argNode.arguments[i];

    if (typeof n === 'string') {
      children.push(n);
      continue;
    }

    if (!n.value) {
      continue;
    }

    if (typeof n.value === 'string') {
      children.push(n.value);
      continue;
    }

    if (Array.isArray(n.value)) {
      n.value.map(v => children.push(v));
      continue;
    }
  }

  appendNodes(children, root);
  return root;
}

function parseStringNode(strNode) {
  const value = strNode.trim();
  const m = value.match(/^%\stable:\s(.*)$/);
  if (m) {
    return { kind: 'table', value: m[1] };
  }
  if (!value || value.indexOf('%') === 0 || value === '[') {
    return null;
  }

  if (value.match(/\$(.*?)\$/)) {
    return { kind: 'text-component', value: parseSpecialSymbols(value), tag: 'p' };
  }

  return { kind: 'text', value, children: [] };
}

function parseCommand(v) {
  const inputAnnotationMatch = v.match(/^input\s([a-zA-Z0-9._\- ]+)\s(.*)$/);
  if (inputAnnotationMatch) {
    const parsed = {
      command: `input ${inputAnnotationMatch[1]}`,
      storeKey: inputAnnotationMatch[1],
      kind: 'input',
      value: '',
      type: 'text',
    };

    const attributesMatch = inputAnnotationMatch[2].match(/[a-zA-Z]+=".*?"/g);
    if (!attributesMatch) {
      return parsed;
    }

    for (let i = 0; i < attributesMatch.length; i++) {
      const attrMatch = attributesMatch[i].match(/([a-zA-Z]+)="(.*)"/);
      // This should never happen.
      if (!attrMatch) {
        console.warn('no attribute match', attributesMatch[i]); // eslint-disable-line no-console
        continue;
      }
      parsed[attrMatch[1].trim()] = attrMatch[2].trim();
    }

    return parsed;
  }

  const attachmentMatch = v.match(/attachment value="(.*)"/);
  if (attachmentMatch) {
    return {
      command: attachmentMatch[0],
      kind: 'attachment',
      value: attachmentMatch[1],
    };
  }

  return { command: v, value: '' };
}

// eslint-disable-next-line max-statements
function tabuToTable(node) {
  const root = { kind: 'inline-table', rows: [] };
  let instructionNode;
  let appendToLastRow;
  let lastInstructionValue;
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];

    const lastRow = root.rows[root.rows.length - 1];
    if (appendToLastRow) {
      lastRow[lastRow.length - 1].value += child.trim().replace(/\\+\s?\[?.*\]?/g, '');
      appendToLastRow = false;
      continue;
    }

    if (typeof child !== 'string') {
      if (child.name === 'iffalse') {
        instructionNode = { kind: 'instruction', command: '', value: '' };
      }

      if (!lastRow) {
        continue;
      }

      if (child.name === 'fi') {
        lastRow[lastRow.length - 1].children.push({ ...instructionNode });
        lastInstructionValue = instructionNode.value;
        instructionNode = null;
      }

      // TODO (edimov) handle `child.name === 'alltt'`.

      if (child.name === '%') {
        lastRow[lastRow.length - 1].value += ' % ';
        appendToLastRow = true;
      }
      continue;
    }
    child = child.trim();
    if (instructionNode) {
      const command = parseCommand(child);
      instructionNode.command = command.command;
      instructionNode.commandKind = command.kind;
      instructionNode.type = command.type;
      instructionNode.storeKey = command.storeKey;
      instructionNode.value = command.value;
      continue;
    }

    if (!child || child.indexOf('%') === 0) {
      continue;
    }

    // If parsing a row, which is the value of an `instruction`
    // node - skip rendering it.
    if (child.indexOf(lastInstructionValue) === 0) {
      if (child.indexOf('&') < 0) {
        lastInstructionValue = null;
        continue;
      }
      // But if current value contains `&` it is the remainder of a
      // `tabu` instruction. Just clean the already appended value of
      // `lastInstructionValue` and continue with the logic.
      const re = new RegExp(`^${lastInstructionValue}\\s?`);
      child = child.replace(re, '');

      lastInstructionValue = null;
      const columnParts = child.split('&');

      for (let j = 0; j < columnParts.length; j++) {
        if (lastRow[j]) {
          continue;
        }
        lastRow[j] = {
          kind: 'textInline',
          value: columnParts[j],
          children: [],
        };
      }
      continue;
    }

    const row = child.split('&').map(c => {
      const value = c.trim().replace(/\\+\s?\[?.*\]?/g, '');
      return {
        kind: 'textInline',
        value,
        children: [],
      };
    });
    root.rows.push(row);
  }

  return root;
}

const textKinds = ['text', 'textInline'];
function isTextNode(node) {
  return textKinds.indexOf(node?.kind) > -1;
}

const tabuKinds = ['tabu', 'longtabu'];
function isTabuNode(node) {
  return tabuKinds.indexOf(node?.name) > -1 || tabuKinds.indexOf(node?.kind) > -1;
}
