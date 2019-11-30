'use strict'
//David Arturo Rodriguez Herrera

//------------- Variables Globales

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const W = canvas.width
const H = canvas.height
const margen = 50
var imgDATA = ctx.getImageData(0,0,canvas.width,canvas.height)
var dev = true
var poniendoVarilla = false
var mult = 1
var barras = []
var varillas = []
var figuras = []
figuras.push(new ASDI())
var fy = 420000

var ecu = 0.003
var ey = 0.0021
var fc = 28000

barras[2] = []
barras[3] = []
barras[4] = []
barras[5] = []
barras[6] = []
barras[7] = []
barras[8] = []
barras[9] = []
barras[10] = []
barras[11] = []
barras[14] = []
barras[18] = []

//Area
barras[2][0] = 0.32
barras[3][0] = 0.71
barras[4][0] = 1.29
barras[5][0] = 1.99
barras[6][0] = 2.84
barras[7][0] = 3.87
barras[8][0] = 5.1
barras[9][0] = 6.45
barras[10][0] = 8.19
barras[11][0] = 10.06
barras[14][0] = 14.52
barras[18][0] = 25.81

//Diametro
barras[2][1] = 6.4/1000
barras[3][1] = 9.5/1000
barras[4][1] = 12.7/1000
barras[5][1] = 15.9/1000
barras[6][1] = 19.1/1000
barras[7][1] = 22.2/1000
barras[8][1] = 25.4/1000
barras[9][1] = 28.7/1000
barras[10][1] = 32.3/1000
barras[11][1] = 35.8/1000
barras[14][1] = 43/1000
barras[18][1] = 57.3/1000

var barraActual = barras[5]
document.getElementById(""+5).childNodes[1].classList.add("activo")

var r = barraActual[1]/2
var colorPrincipal = 'black'
var colorSecundario = 'white'

var indicesMov = []

var b = document.getElementById('base').value
var h = document.getElementById('altura').value
var dprima = document.getElementById('recubrimiento').value/100

var coordenadaMaxima = Math.max(b,h)
//------------- Funciones 

function calcularDeformaciones(h,c) {
	for (var i = 0; i < varillas.length; i++) {
		let barrai = varillas[i][0]
		let coordX = varillas[i][1]
		let coordY = varillas[i][2]
		varillas[i][3] = Math.abs(ecu*(Math.abs(h-coordY)/c-1))
		varillas[i][4] = -(ecu*(Math.abs(h-coordY)/c-1))/varillas[i][3]
		varillas[i][5] = varillas[i][3] >= ey ? fy : 200000000*varillas[i][3]
		varillas[i][6] = ((h-coordY)-h/2)
	}
}
function pnominal(c) {
	let pc = 0.85*(fc)*b*b1(fc)*c
	let psp = 0
	let psn = 0
	for (var i = 0; i < varillas.length; i++) {
		psn += (varillas[i][4]>0)*varillas[i][4]*(varillas[i][0][0]/10000)*varillas[i][5]
		psp += (varillas[i][4]<0)*varillas[i][4]*(varillas[i][0][0]/10000)*varillas[i][5]
	}
	return [pc,psp,psn]
}
function mnominal(c) {
	let mnc = -0.85*(fc)*b*b1(fc)*c*(h/2 - b1(fc)*c/2)
	let msn = 0
	let msp = 0
	for (var i = 0; i < varillas.length; i++) {
		msn += (varillas[i][4]>0)*varillas[i][4]*(varillas[i][0][0]/10000)*varillas[i][5]*varillas[i][6]
		msp += (varillas[i][4]<0)*varillas[i][4]*(varillas[i][0][0]/10000)*varillas[i][5]*varillas[i][6]
	}
	return [-mnc , -msn , -msp]
}
function b1(fc) {
	if (fc/1000 <= 28) {
		return 0.85
	} else if (fc/1000 <= 56) {
		return 0.85 - 0.05/7*(fc/1000-28)
	} else {
		return 0.65
	}
}
//------------- Funciones Interfaz Grafica

function actualizar() {
	ctx.clearRect(0,0,W,H)
	b = parseFloat(document.getElementById('base').value)
	h = parseFloat(document.getElementById('altura').value)
	dprima = parseFloat(document.getElementById('recubrimiento').value)/100
	if (b != 0 && h != 0 && dprima != 0) {
		dibujarViga()
		imgDATA = ctx.getImageData(0,0,canvas.width,canvas.height)
	} else {
		console.log('No se introdujeron los parametros correctos')
	}
}

function dibujarViga() {
	coordenadaMaxima = Math.max(b,h)
	mult = (W-margen*2)/coordenadaMaxima
	draw(colorPrincipal, 0, 0, b, 0, ctx)
	draw(colorPrincipal, b, 0, b, h, ctx)
	draw(colorPrincipal, 0, h, b, h, ctx)
	draw(colorPrincipal, 0, h, 0, 0, ctx)

	drawD('gray', -0.01, dprima, b+0.01, dprima, ctx)
	drawD('gray', -0.01, h/2, b+0.01, h/2, ctx)
	drawD('gray', b-dprima, 0-0.01, b-dprima, h+0.01, ctx)
	drawD('gray', b/2, 0-0.01, b/2, h+0.01, ctx)
	drawD('gray', -0.01, h-dprima, b+0.01, h-dprima, ctx)
	drawD('gray', 0+dprima, h+0.01, 0+dprima, -0.01, ctx)

	let limiteX = (b-dprima)*100
	let limiteY = (h-dprima)*100

	indicesMov = []
	for (let i = dprima*100; i < limiteX+1; i++) {
		for (var j = dprima*100; j < limiteY+1; j++) {
			indicesMov.push(((i/100)*mult + margen) +","+ ((W-margen) - (j/100)*mult))
		}
	}
}

function draw(color, xi, yi, xf, yf, ctx) {
	mult = (W-margen*2)/coordenadaMaxima
	ctx.setLineDash([])
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = "2"
    ctx.moveTo(xi*mult + margen , (W-margen) - yi*mult)
    ctx.lineTo(xf*mult + margen , (W-margen) - yf*mult)
    ctx.stroke()
    ctx.closePath()
}
function drawD(color, xi, yi, xf, yf, ctx) {
	mult = (W-margen*2)/coordenadaMaxima
	ctx.setLineDash([5,5])
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = "2"
    ctx.moveTo(xi*mult + margen , (W-margen) - yi*mult)
    ctx.lineTo(xf*mult + margen , (W-margen) - yf*mult)
    ctx.stroke()
    ctx.closePath()
}
function drawEasy(xi,yi,xf,yf) {
	let a = coordenadaMaxima
	coordenadaMaxima = W 
	draw('black', xi, yi, xf, yf, ctx)
	coordenadaMaxima = a
}

function agregarVarilla() {
	abrirModalVarillas()
	poniendoVarilla = true
}

function moviendo(event) {
  let x = event.offsetX
  let y = event.offsetY
  if (poniendoVarilla) {
	  let xr = x
	  let yr = y
	  let u = proveNear(x,y)
	  x = parseFloat(u.split(",")[0])
	  y = parseFloat(u.split(",")[1])
	  ctx.putImageData(imgDATA,0,0)
	  ctx.strokeStyle = 'black'
	  ctx.setLineDash([])
	  ctx.beginPath()
	  ctx.arc(x,y,r*mult,0,2*Math.PI)
	  ctx.stroke()
  }
}

function clickk(event) {
  let x = event.offsetX
  let y = event.offsetY
  if (poniendoVarilla) {
	  let xr = x
	  let yr = y
	  let u = proveNear(x,y)
	  x = parseFloat(u.split(",")[0])
	  y = parseFloat(u.split(",")[1])
	  ctx.setLineDash([])
	  ctx.strokeStyle = 'black'
	  ctx.beginPath()
	  ctx.arc(x,y,r*mult,0,2*Math.PI)
	  ctx.fill()
	  imgDATA = ctx.getImageData(0,0,canvas.width,canvas.height)
	  varillas.push([barraActual,(x-margen)/mult,h-(y-margen)/mult])
  }
}
function mouseFuera() {
	ctx.putImageData(imgDATA,0,0)
}

function proveNear(x,y) {
	let near = W
	let selected = x+","+y
	let x1 = 0
	let y1 = 0
	for (var i = 0; i < indicesMov.length; i++) {
		x1 = parseFloat(indicesMov[i].split(",")[0])
		y1 = parseFloat(indicesMov[i].split(",")[1])
		let d = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y))
		if (d < near) {
	  		near = d
	  		selected = indicesMov[i]
		}
	}
  return selected
}
function abrirModalVarillas() {
	var mods = document.querySelectorAll('#modal_1');
	[].forEach.call(mods, function(mod){ mod.checked = true; });
}
function abrirModalDI() {
	var mods = document.querySelectorAll('#modal_2');
	[].forEach.call(mods, function(mod){ mod.checked = true; });
}
function definirBarra(n) {
	let g = [2,3,4,5,6,7,8,9,10,11,14,18]
	barraActual = barras[n]
	for (var i = 0; i < g.length; i++) {
		document.getElementById(""+g[i]).childNodes[1].classList.remove("activo")
	}
	document.getElementById(""+n).childNodes[1].classList.add("activo")
	r = barraActual[1]/2
}
function di(n,k) {
	let paso = h/n
	let result = []
	let as = 0
	for (var i = 0; i < varillas.length; i++) {
		as += varillas[i][0][0]
	}
	let compresionPura = (0.85*fc*(b*h-as/10000)+fy*as/10000)
	let cphi = compresionPura*0.75*0.65
	let phi = calcularPhi(varillas)
	result.push([-fy*as/10000,0,0,-fy*as/10000*0.9,0,0])
	for (var i = 1; i < n; i++) {
		let c = paso * i
		calcularDeformaciones(h,c)
		let phi = calcularPhi(varillas)
		let a = pnominal(c)
		let b = mnominal(c)
		let o = a[0]+a[1]+a[2]
		let oo = b[0]+b[1]+b[2]
		if (!isNaN(o) && !isNaN(oo)) {
			result.push([o,oo*k,0, o*phi<cphi ? o*phi : cphi,oo*k*phi,0])
		}
	}
	result.push([compresionPura,0,0,compresionPura*0.75*0.65,0,0])
	return result
}
var data = []
var dataPhi = []
function didi(n) {
	let datos1 = b
	let datos2 = h
	let datos3 = varillas
	poniendoVarilla = false
	let g1 = di(n,1)
	let trace1 = {
	  x: getCol(g1, 1),
	  y: getCol(g1, 0),
	  mode: 'lines',
	  text: getCol(g1, 2),
	  name: 'Nominal'
	}
	let trace2 = {
	  x: getCol(g1, 4),
	  y: getCol(g1, 3),
	  mode: 'lines',
	  text: getCol(g1, 5),
	  name: 'Nominal-phi'
	}
	let layout = {
	  title:'Diagrama de Interacción Eje X+',
	  xaxis: {
	  	title:'Momento [KN-m]'
	  },
	  yaxis: {
	  	title:'Carga Axial [KN]'
	  }
	}
	data = [trace1,trace2]
	Plotly.newPlot('graficas', data,layout)


	for (var i = 0; i < varillas.length; i++) {
		let antiguoy = varillas[i][2]
		varillas[i][2] = h - antiguoy
	}
	let g2 = di(n,-1)
	trace1 = {
	  x: getCol(g2, 1),
	  y: getCol(g2, 0),
	  mode: 'lines',
	  text: getCol(g2, 2),
	  name: 'Nominal'
	}
	trace2 = {
	  x: getCol(g2, 4),
	  y: getCol(g2, 3),
	  mode: 'lines',
	  text: getCol(g2, 5),
	  name: 'Nominal-phi'
	}
	layout = {
	  title:'Diagrama de Interacción Eje X-',
	  xaxis: {
	  	title:'Momento [KN-m]'
	  },
	  yaxis: {
	  	title:'Carga Axial [KN]'
	  }
	}
	data = [trace1,trace2]
	Plotly.newPlot('graficas2', data,layout)
		let uuu = b
		b = h
		h = uuu
	for (var i = 0; i < varillas.length; i++) {
		let antiguoy = varillas[i][2]
		let antiguox = varillas[i][1]
		varillas[i][2] = antiguox
		varillas[i][1] = antiguoy
	}
	let g3 = di(n,1)
	trace1 = {
	  x: getCol(g3, 1),
	  y: getCol(g3, 0),
	  mode: 'lines',
	  text: getCol(g3, 2),
	  name: 'Nominal'
	}
	trace2 = {
	  x: getCol(g3, 4),
	  y: getCol(g3, 3),
	  mode: 'lines',
	  text: getCol(g3, 5),
	  name: 'Nominal-phi'
	}
	layout = {
	  title:'Diagrama de Interacción Eje Y+',
	  xaxis: {
	  	title:'Momento [KN-m]'
	  },
	  yaxis: {
	  	title:'Carga Axial [KN]'
	  }
	}
	data = [trace1,trace2]
	Plotly.newPlot('graficas3', data,layout)

	for (var i = 0; i < varillas.length; i++) {
		let antiguoy = varillas[i][2]
		varillas[i][2] = h - antiguoy
	}
	let g4 = di(n,-1)
	trace1 = {
	  x: getCol(g4, 1),
	  y: getCol(g4, 0),
	  mode: 'lines',
	  text: getCol(g4, 2),
	  name: 'Nominal'
	}
	trace2 = {
	  x: getCol(g4, 4),
	  y: getCol(g4, 3),
	  mode: 'lines',
	  text: getCol(g4, 5),
	  name: 'Nominal-phi'
	}
	layout = {
	  title:'Diagrama de Interacción Eje Y-',
	  xaxis: {
	  	title:'Momento [KN-m]'
	  },
	  yaxis: {
	  	title:'Carga Axial [KN]'
	  }
	}
	data = [trace1,trace2]
	Plotly.newPlot('graficas4', data,layout)

	let l = []
	let l1 = []
	let l2 = []

	let ph = []
	let ph1 = []
	let ph2 = []

	l.push(getCol(g1, 0))
	l.push(getCol(g2, 0))
	l.push(getCol(g3, 0))
	l.push(getCol(g4, 0))

	l1.push(getCol(g1, 1))
	l1.push(getCol(g2, 1))
	l1.push(getCol(g3, 1))
	l1.push(getCol(g4, 1))

	l2.push(getCol(g1, 2))
	l2.push(getCol(g2, 2))
	l2.push(getCol(g3, 2))
	l2.push(getCol(g4, 2))

	let d1 = l2[3].concat(l2[2].concat(l1[0].concat(l1[1])))
	let d2 = l1[3].concat(l1[2].concat(l2[0].concat(l2[1])))
	let d3 = l[3].concat(l[2].concat(l[0].concat(l[1])))


	ph.push(getCol(g1, 3))
	ph.push(getCol(g2, 3))
	ph.push(getCol(g3, 3))
	ph.push(getCol(g4, 3))

	ph1.push(getCol(g1, 4))
	ph1.push(getCol(g2, 4))
	ph1.push(getCol(g3, 4))
	ph1.push(getCol(g4, 4))

	ph2.push(getCol(g1, 5))
	ph2.push(getCol(g2, 5))
	ph2.push(getCol(g3, 5))
	ph2.push(getCol(g4, 5))

	let pph1 = ph2[3].concat(ph2[2].concat(ph1[0].concat(ph1[1])))
	let pph2 = ph1[3].concat(ph1[2].concat(ph2[0].concat(ph2[1])))
	let pph3 = ph[3].concat(ph[2].concat(ph[0].concat(ph[1])))

	data=[
		{
		type: 'mesh3d',
		x: d1,
		y: d2,
		z: d3,
		intensity: d3,
		showscale: true,
		opacity: 1,
		colorbar: {title: {text: 'Carga Axial[KN]'}},
		}
	]
	dataPhi=[
		{
		type: 'mesh3d',
		x: pph1,
		y: pph2,
		z: pph3,
		intensity: pph3,
		showscale: true,
		opacity: 1,
		colorbar: {title: {text: 'Carga Axial[KN] - Phi'}},
		}
	]
	layout = {
	  title:'Cebollita con 4 lados'
	}
	Plotly.newPlot('graficas5', data,layout)
	b = datos1
	h = datos2
	varillas = datos3
}
function getCol(matrix, col){
   var column = [];
   for(var i=0; i<matrix.length; i++){
      column.push(matrix[i][col]);
   }
   return column;
}
function diagramaDeInteraccion() {
	didi(400)
	abrirModalDI()
}
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
    	var mods = document.querySelectorAll('.modal > [type=checkbox]');
    	[].forEach.call(mods, function(mod){ mod.checked = false; })
    }
};
function calcularPhi(varillas) {
	let ephi = 0
	for (var i = 0; i < varillas.length; i++) {
		if (varillas[i][3]>ephi && varillas[i][4] < 0) {
			ephi = varillas[i][3]
		}
	}
	if (ephi < 0.0021) {
		return 0.65
	} else if (ephi < 0.005) {
		return 0.65 + (0.9-0.65)/(0.005-0.0021)*(ephi-0.0021)
	} else {
		return 0.9
	}
}
function actualizarModal3D() {
	let fact = document.getElementById('factSeguridad').checked
	if (fact) {
		let layout = {
		  title:'Cebollita con 4 lados - Phi'
		}
		Plotly.react('graficas5', dataPhi,layout)
	} else {
		let layout = {
		  title:'Cebollita con 4 lados'
		}
		Plotly.react('graficas5', data,layout)
	}
}
function saveString() {
	let  a = ''
	let sepFiguras = '~~~'
	let sepAtributos = '???'
	for (var i = 0; i < figuras.length; i++) {
		a += 'FIGURA'+ i + sepAtributos + b + sepAtributos + h + sepAtributos + dprima + sepAtributos + '\n'
		for (var k = 0; k < varillas.length; k++) {
			a += varillas[k].join('===') + '\n'
		}
	}
	download(a,'ASections[DI]-'+ new Date().toLocaleString() +'.txt', 'text/txt')
}
function download(text, name, type) {
	var a = document.getElementById('a')
	var file = new Blob([text], {type: type})
	a.href = URL.createObjectURL(file)
	a.download = name
}