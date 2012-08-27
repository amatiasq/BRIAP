function hideMochaSuccess() {
	function select(selector) {
		return Array.prototype.slice.call(document.querySelectorAll(selector));
	}
	var failed = false;

	select('#mocha .suite').concat(select('#mocha .test')).forEach(function(el) {
		el.style.display = 'none';
	});

	select('#mocha .fail').forEach(function(current) {
		failed = true;
		current.style.display = 'block';
		while (current.parentNode) {
			current = current.parentNode;
			if (current.className && current.className === 'suite') current.className += " suiteFail";
		}
	});

	select('#mocha .suiteFail').forEach(function(el) {
		el.style.display = 'block';
	});

	return failed;
}

function htmlcov() {
	function percent(total, coverage) {
		return Math.round(coverage / total * 100);
	}

	function stats(total, coverage) {
		return '<div id="stats" class="high"><div class="percentage">' + percent(total, coverage) + '%</div><div class="sloc">' + total + '</div>' + '<div class="hits">' + coverage + '</div><div class="misses">' + (total - coverage) + '</div></div>';
	}

	var cov = _$jscoverage;
	var menu = [];
	var files = [];
	var lineses = 0;
	var successes = 0;

	function parseFile(file, lines, source) {
		var must = lines.filter(function(val) { return val !== undefined });
		var success = must.filter(function(val) { return val !== 0; })
		//var success = lines.filter(function(val) { return val === 0 });
		var perc = percent(must.length, success.length);
		var path = file.split('/');
		var filename = path.pop();
		var folder = path.join('/');

		lineses += must.length;
		successes += success.length;

		menu.push('<li><span class="cov high">' + perc + '</span><a href="#' + file + '">');
		if (folder) menu.push('<span class="dirname">' + folder + '</span>');
		menu.push('<span class="basename">' + filename + '</span></a><li>');

		files.push('<div class="file"><a name="' + file + '"></a><h2 id="' + filename + '">' + filename + '</h2>' + stats(must.length, success.length) + '<table id="source"><thead><tr><th>Line</th><th>Hits</th><th>Source</th></tr></thead><tbody>');

		var hit, row, val, next;
		for (var i = 0; i < source.length; i++) {
			val = lines[i+1];
			hit = row = '';

			if (val !== undefined) {
				hit = val;
				row = ' class="' + (val === 0 ? 'miss' : 'hit') + '"';
			}

			files.push('<tr' + row + '><td class="line">' + i + '</td><td class="hits">' + hit + '</td><td class="source">' + lines.source[i] + '</td></tr>');
		}

		files.push('</tbody></table></div>');
	}

	var mocha = document.querySelector('#mocha')
	mocha.parentNode.removeChild(mocha);

	for (var file in cov) {
		if (file.indexOf('.spec.js') !== -1) continue;

		parseFile(file, cov[file], cov[file].source);
	}

	var div = document.createElement('div');
	div.innerHTML = '<div id="coverage"><h1 id="overview">Coverage</h1><div id="menu"><ul></ul></div>' + stats(lineses, successes) + '<div id="files"></div></div>';
	div.querySelector('#menu').innerHTML = menu.join('');
	div.querySelector('#files').innerHTML = files.join('');

	document.body.appendChild(div);
}
