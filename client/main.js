document.addEventListener('DOMContentLoaded', function () {
    var Slate = require('slatejs');
    var preview = document.getElementById('preview');

    var m = Slate.model;
	var e = Slate.editor;

	console.log("I don't do stuff till I'm ready.");

	var table = new m.Table(1, [
	//new m.THead(2,[
		new m.Row(5,[new m.Cell(6,["Some text to go in the cell."]), new m.Cell(15,["Header2"])]),
	//]), 
	//new m.TBody(3,[
		new m.Row(7,[new m.Cell(8,[
	"Text that is not bold before",
	m.tag('strong',{}),
	"Some bold text to go in the ",
	m.tag('em',{}),"bold italic"," cell.",
	m.endtag('strong'), " and not bold after.",
	m.endtag('em')]),
			new m.Cell(17,["99"], {rowSpan: 2})
		]),
		new m.Row(27,[new m.Cell(28,[
	"Text that is not bold before",
	m.tag('strong',{}),
	"Some bold text to go in the ",
	m.tag('em',{}),"bold italic"," cell.",
	m.endtag('strong'), " and not bold after.",
	m.endtag('em')])
		]),
		new m.Row(37,[new m.Cell(38,[
	"Text that is not bold before",
	m.tag('strong',{}),
	"Some bold text to go in the ",
	m.tag('em',{}),"bold italic"," cell.",
	m.endtag('strong'), " and not bold after.",
	m.endtag('em')], {colSpan: 2})
		]),
	//	]), 
	//new m.TFoot(4,[])
	], {alignments: ['left','right']});

var tdoc = new m.Document(1,[
	new m.Section(2,[new m.P(4,["This is some text."])]), 
	new m.Section(3,[])]);
var topsB = new Slate.Operations()
		.retain(22)
		.insert({_type:'P'})
		.insert('This is some text')
		.insert({_type:'Section'})
		.insert({_type:'H3'})
		.insert('this is more text')
		.end(tdoc.length);

var ttdoc = m.apply(tdoc, topsB);

var doc = new m.Document(10,[
	new m.Section(12,[
		new m.H1(16, ["Dummy document"]), 
		new m.P(14,["This is some text. Lorem ipsum dolor",m.endtag('strong')," sit amet, consectetur adipisicing elit. Corrupti ",m.tag('a',{href: "http://google.co.uk"}),"vitae",m.endtag('a'),", aliquid ex necessitatibus repellat",m.tag('sup',{}),"TM",m.endtag('sup')," a illo fuga dolore aperiam totam tempore nisi neque delectus labore, nihil quae dignissimos dolores mollitia? Vel sunt neque voluptatibus excepturi laboriosam possimus adipisci quidem dolores, omnis nemo dolore",m.tag('strong',{})," eligendi blanditiis, voluptatem in doloribus hic aperiam."])]), 
	new m.Section(13,[
		table, 
		new m.P(9,["This is a test"]),
		new m.Ulli(20,["First list item"]),
		new m.Ulli(21,["Second list item"]),
		new m.Olli(22,["First list item"]),
		new m.Olli(23,["Second list item"]),
		new m.Code(24,["Some code here"]),
		new m.Code(25,["Some more code here"]),
		new m.Quote(100,[m.tag('strong',{}),"This is a really ",m.endtag('strong'),"important quote."]),
		new m.Quote(18,["This is a ",m.tag('strong',{}),"really ",m.endtag('strong'),"important quote."])])
	]);

//for debugging
var cursor = doc.selectedNodes(17, 17)[0];

var op = new Slate.Operations().retain(3).remove("Dummy").insert("Cool").end(doc.length);


function makeHugeTable(op, rows, cols) {
	var al = ['left'];
	op.insert({_type:'Table', attributes: {alignments: al}});
	//op.insert({attrib:'alignments', value:al});
	//op.insert({_type:'THead'});
	op.insert({_type:'Row'});
	for (var c = 0; c < cols; c++)
		op.insert({_type:'Cell'}).insert('Header');
	//op.insert({_type:'TBody'});
	for (var r = 0; r < rows; r++) {
		op.insert({_type:'Row'})
		for (var c = 0; c < cols; c++) {
			op.insert({_type:'Cell'}).insert("Cell " + r + ":" + c );
		}
	}
	for (var c = 1; c < cols; c++)
		al.push('right');



}

var opB = new Slate.Operations().retain(doc.children[0].length-1).insert({_type:'P'}).insert("Some Text");

makeHugeTable(opB, 6000, 5);

//doc = m.apply(doc, op)

opB.end(doc.length);

//opB = opB.transform(op);

var opC = new Slate.Operations().retain(480).remove('Cell').insert("Bell");

var dummy = new BCSocket(null, {reconnect: true});
dummy.canSendJSON = false; //need this because goog.json.serialize doesn't call toJSON

var sjs = new Slate.sharejs.Connection(dummy);
sjs.debug = true;
var sharedoc = sjs.get('play','anonymous8');
sharedoc.subscribe();
var store;

//store.apply(opC);

var editor;

var Selection = Slate.Selection;

sharedoc.whenReady(function() {
	if (!sharedoc.type) sharedoc.create('slate0', doc);
	//fixup doc.snapshot
	sharedoc.snapshot = Slate.slate0.type.deserialize(sharedoc.snapshot);
	store = new Slate.Store(sharedoc);

	
	/*store.apply(opB);
	var pth = store.document().path(441);
	var tblp = pth[2];
	var tbl = tblp.node;
	var ops = new Slate.Operations().retain(441-tblp.offset);
	tbl.insertRows(ops, 2, 3);
	ops.end(store.document().length);
	store.apply(ops);*/

	editor = e.Editor({store: store});

	e.friar.renderComponent(editor, preview);

});


});