'use-strict'
//David Arturo Rodriguez Herrera
class ASDI{
	constructor(b,h,d,varillas,img) {
		this.b = b
		this.h = h
		this.d = d
		this.varillas = varillas
		this.img = img
	}
}
var numeroBarraActual = 5
var estaGuardada = false
var figuraActual = 0
//------------- Variables Globales
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const W = canvas.width
const H = canvas.height
var margen = 30
var imgDATA = ctx.getImageData(0,0,canvas.width,canvas.height)
var dev = true
var poniendoVarilla = false
var mult = 1
var barras = []
var varillas = []
var figuras = []
var fy = 420000
var ecu = 0.003
var ey = 0.0021
var fc = 28000
var cuantia = 0.0
var presicionDeGrilla = 0.01
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
barras[6][0] = 2.86
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

function buscarVarillaPorDiametro(diam) {
	for (var i = 0; i < barras.length; i++) {
		if (barras[i] != undefined) {
			if (barras[i][1] == diam) {
				return i
			}
		}
	}
	return -1
}

var barraActual = barras[5]
document.getElementById(""+5).childNodes[1].classList.add("activo")
var contenedor = document.getElementById('contenedorSecciones')

var r = barraActual[1]/2
var colorPrincipal = 'black'
var colorSecundario = 'white'

var indicesMov = []

var b = document.getElementById('base').value
var h = document.getElementById('altura').value
var dprima = document.getElementById('recubrimiento').value/100

var coordenadaMaxima = Math.max(b,h)
//------------- Funciones 

function calcularDeformaciones(c,b,h,dprima,varillas) {
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
function pnominal(c,b,h,dprima,varillas) {
	let pc = 0.85*(fc)*b*b1(fc)*c
	let psp = 0
	let psn = 0
	for (var i = 0; i < varillas.length; i++) {
		psn += (varillas[i][4]>0)*varillas[i][4]*(varillas[i][0][0]/10000)*varillas[i][5]
		psp += (varillas[i][4]<0)*varillas[i][4]*(varillas[i][0][0]/10000)*varillas[i][5]
	}
	return [pc,psp,psn]
}
function mnominal(c,b,h,dprima,varillas) {
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
	varillas = []
	ctx.clearRect(0,0,W,H)
	b = parseFloat(document.getElementById('base').value)
	h = parseFloat(document.getElementById('altura').value)
	dprima = parseFloat(document.getElementById('recubrimiento').value)/100
	if (b != 0 && h != 0 && dprima != 0) {
		dibujarViga()
		imgDATA = ctx.getImageData(0,0,canvas.width,canvas.height)
	} else {
	}
	estaGuardada = false
}

function dibujarViga() {
	ctx.clearRect(0,0,W,H)
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

	let limiteX = (b-dprima)/presicionDeGrilla
	let limiteY = (h-dprima)/presicionDeGrilla

	indicesMov = []
	for (let i = dprima/presicionDeGrilla; i < limiteX+1; i++) {
		for (var j = dprima/presicionDeGrilla; j < limiteY+1; j++) {
			indicesMov.push(((i*presicionDeGrilla)*mult + margen) +","+ ((W-margen) - (j*presicionDeGrilla)*mult))
		}
	}
	imgDATA = ctx.getImageData(0,0,canvas.width,canvas.height)
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
	  ctx.fillText("("+ (x/mult-margen/mult).toFixed(3) +", "+ (Math.max(b,h)-y/mult+margen/mult).toFixed(3) +")", x - 10 ,y -10);
	  ctx.setLineDash([])
	  ctx.beginPath()
	  ctx.arc(x,y,r*mult,0,2*Math.PI)
	  ctx.stroke()
  	dibujarVarillasActuales(varillas)
  }
}

function clickk(event) {
	let g = varillas

  let x = event.offsetX
  let y = event.offsetY
  if (poniendoVarilla) {
	  let xr = x
	  let yr = y
	  let u = proveNear(x,y)
	  x = parseFloat(u.split(",")[0])
	  y = parseFloat(u.split(",")[1])
	  let varillaNueva = [barraActual,(x-margen)/mult,Math.max(b,h)-(y-margen)/mult]
	  varillaNueva['n'] = numeroBarraActual
	  varillas.push(varillaNueva)
  	estaGuardada = false
  }
  actualizar()
	varillas = g
  	dibujarVarillasActuales(varillas)
}
function mouseFuera() {
	ctx.putImageData(imgDATA,0,0)
	dibujarVarillasActuales(varillas)
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
	numeroBarraActual = n
	for (var i = 0; i < g.length; i++) {
		document.getElementById(""+g[i]).childNodes[1].classList.remove("activo")
	}
	document.getElementById(""+n).childNodes[1].classList.add("activo")
	r = barraActual[1]/2
}
function di(n,k,b,h,varillas,dprima) {
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
		calcularDeformaciones(c,b,h,dprima,varillas)
		let phi = calcularPhi(varillas)
		let a = pnominal(c,b,h,dprima,varillas)
		let p = mnominal(c,b,h,dprima,varillas)
		let o = a[0]+a[1]+a[2]
		let oo = p[0]+p[1]+p[2]
		if (!isNaN(o) && !isNaN(oo)) {
			result.push([o,oo*k,0, o*phi<cphi ? o*phi : cphi,oo*k*phi,0])
		}
	}
	result.push([compresionPura,0,0,compresionPura*0.75*0.65,0,0])
	return result
}
var data = []
var dataPhi = []
function didi(n,b,h,ffff,dprima) {
	if (estaGuardada) {
	} else {
		agregarSeccion()
	}
	const fuck = ffff
	poniendoVarilla = false

	let g1 = di(n,1,b,h,fuck,dprima)
	let pcontrol = ptsControl(b,h,dprima,fuck,1)

	let tracepcontrol = {
	  x: getCol(pcontrol, 1),
	  y: getCol(pcontrol, 0),
	  mode: 'lines',
	  text: getCol(pcontrol, 2),
	  name: 'Puntos Control',
	  line: {
	    dash: 'dot',
	    width: 4
	  }
	}

	let tracepcontrolPhi = {
	  x: getCol(pcontrol, 4),
	  y: getCol(pcontrol, 3),
	  mode: 'lines',
	  text: getCol(pcontrol, 5),
	  name: 'Puntos Control - Phi',
	  line: {
	    dash: 'dot',
	    width: 4
	  }
	}

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
	data = [tracepcontrol,tracepcontrolPhi,trace1,trace2]
	Plotly.newPlot('graficas', data,layout)
	for (var i = 0; i < fuck.length; i++) {
		let antiguoy = fuck[i][2]
		fuck[i][2] = h - antiguoy
	}
	let g2 = di(n,-1,b,h,fuck,dprima)

	pcontrol = ptsControl(b,h,dprima,fuck,-1)

	tracepcontrol = {
	  x: getCol(pcontrol, 1),
	  y: getCol(pcontrol, 0),
	  mode: 'lines',
	  text: getCol(pcontrol, 2),
	  name: 'Puntos Control',
	  line: {
	    dash: 'dot',
	    width: 4
	  }
	}

	tracepcontrolPhi = {
	  x: getCol(pcontrol, 4),
	  y: getCol(pcontrol, 3),
	  mode: 'lines',
	  text: getCol(pcontrol, 5),
	  name: 'Puntos Control - Phi',
	  line: {
	    dash: 'dot',
	    width: 4
	  }
	}

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
	data = [tracepcontrol,tracepcontrolPhi,trace1,trace2]
	Plotly.newPlot('graficas2', data,layout)
	let uuu = b
	b = h
	h = uuu
	for (var i = 0; i < fuck.length; i++) {
		let antiguoy = fuck[i][2]
		let antiguox = fuck[i][1]
		fuck[i][2] = antiguox
		fuck[i][1] = antiguoy
	}
	let g3 = di(n,1,b,h,fuck,dprima)

	pcontrol = ptsControl(b,h,dprima,fuck,1)

	tracepcontrol = {
	  x: getCol(pcontrol, 1),
	  y: getCol(pcontrol, 0),
	  mode: 'lines',
	  text: getCol(pcontrol, 2),
	  name: 'Puntos Control',
	  line: {
	    dash: 'dot',
	    width: 4
	  }
	}

	tracepcontrolPhi = {
	  x: getCol(pcontrol, 4),
	  y: getCol(pcontrol, 3),
	  mode: 'lines',
	  text: getCol(pcontrol, 5),
	  name: 'Puntos Control - Phi',
	  line: {
	    dash: 'dot',
	    width: 4
	  }
	}

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
	data = [tracepcontrol,tracepcontrolPhi,trace1,trace2]
	Plotly.newPlot('graficas3', data,layout)
	for (var i = 0; i < fuck.length; i++) {
		let antiguoy = fuck[i][2]
		fuck[i][2] = h - antiguoy
	}
	let g4 = di(n,-1,b,h,fuck,dprima)
	pcontrol = ptsControl(b,h,dprima,fuck,-1)

	tracepcontrol = {
	  x: getCol(pcontrol, 1),
	  y: getCol(pcontrol, 0),
	  mode: 'lines',
	  text: getCol(pcontrol, 2),
	  name: 'Puntos Control',
	  line: {
	    dash: 'dot',
	    width: 4
	  }
	}

	tracepcontrolPhi = {
	  x: getCol(pcontrol, 4),
	  y: getCol(pcontrol, 3),
	  mode: 'lines',
	  text: getCol(pcontrol, 5),
	  name: 'Puntos Control - Phi',
	  line: {
	    dash: 'dot',
	    width: 4
	  }
	}
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
	data = [tracepcontrol,tracepcontrolPhi,trace1,trace2]
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
	for (var i = 0; i < fuck.length; i++) {
		let antiguoy = fuck[i][2]
		let antiguox = fuck[i][1]
		fuck[i][2] = antiguox
		fuck[i][1] = antiguoy
	}
	for (var i = 0; i < fuck.length; i++) {
		let antiguoy = fuck[i][2]
		let antiguox = fuck[i][1]
		fuck[i][2] = b - antiguoy
		fuck[i][1] = h - antiguox
	}
}
function getCol(matrix, col){
   var column = [];
   for(var i=0; i<matrix.length; i++){
      column.push(matrix[i][col]);
   }
   return column;
}
function diagramaDeInteraccion() {
	let putasMierdas = []
	for (var i = 0; i < varillas.length; i++) {
		putasMierdas.push(varillas[i])
	}
	didi(100,b,h,putasMierdas,dprima)
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
    	data = []
		dataPhi = []
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
let sepAtributos = '???'
function saveString() {
	let a = ''
	for (var i = 0; i < figuras.length; i++) {
		a += 'FIGURA'+ i + sepAtributos + figuras[i].b + sepAtributos + figuras[i].h + sepAtributos + figuras[i].d + sepAtributos + figuras[i].img + sepAtributos + '\n'
		for (var k = 0; k < figuras[i].varillas.length; k++) {
			a += figuras[i].varillas[k].join('===') + '\n'
		}
		a += '****'
	}
	download(a,'ASections[DI]-['+ new Date().toLocaleString() +'].ase', 'text/ase')
}
function download(text, name, type) {
	var a = document.getElementById('a')
	var file = new Blob([text], {type: type})
	a.href = URL.createObjectURL(file)
	a.download = name
}
function agregarSeccion() {
	let data = canvas.toDataURL()
	let img = new Image()
	img.src = data
	let nuevp = new ASDI(b,h,dprima,varillas,data)
	figuras.push(nuevp)
	img.onload = function () {
		agregarImagenSeccion(this,'Col_' + figuras.length,figuras.length-1)
	}
	estaGuardada = true
}
function agregarImagenSeccion(img,nameSec,u) {
	var canvas = document.createElement('canvas')
	var ctx = canvas.getContext('2d')
	canvas.width = 50
	canvas.height = 50
	ctx.drawImage(img, 0, 0, 50, 50)
	let data = canvas.toDataURL()
	var myImage = new Image()
	myImage.src = data
	myImage.onload = function () {
		let a = document.createElement('div')
		a.classList.add('boxE')
		let b = document.createElement('button')
		b.classList.add('btn')
		b.classList.add('btn-white')
		b.classList.add('btn-animation-1')
		b.setAttribute("onclick", 'cargarFigura(' + (u) + ')');
		let c = myImage
		c.classList.add('boxE')
		b.innerHTML = nameSec
		b.appendChild(c)
		a.appendChild(b)
	   	contenedor.appendChild(a)
	}
}
function agregarImagenSeccion2(img,nameSec,u) {
	let imgen = new Image()
	imgen.src = img
	imgen.onload = function () {
		var canvas = document.createElement('canvas')
		var ctx = canvas.getContext('2d')
		canvas.width = 50
		canvas.height = 50
		ctx.drawImage(imgen, 0, 0, 50, 50)
		let data = canvas.toDataURL()
		var myImage = new Image()
		myImage.src = data
		myImage.onload = function () {
			let a = document.createElement('div')
			a.classList.add('boxE')
			let b = document.createElement('button')
			b.classList.add('btn')
			b.classList.add('btn-white')
			b.classList.add('btn-animation-1')
			b.setAttribute("onclick", 'cargarFigura(' + (u) + ')');
			let c = myImage
			c.classList.add('boxE')
			b.innerHTML = nameSec
			b.appendChild(c)
			a.appendChild(b)
		   	contenedor.appendChild(a)
		}
	}
}
function dibujarSecciones() {
	for (var i = 0; i < figuras.length; i++) {
		let ttt = new Image()
		ttt.src = figuras[i].img
		ttt.onload = function () {
			agregarImagenSeccion(ttt,'Col_'+(i+1),i)
		}
	}
}
function cargarFigura(i) {
	figuraActual = i
	coordenadaMaxima = -999999999999999
	document.getElementById('base').value = figuras[figuraActual].b
	document.getElementById('altura').value = figuras[figuraActual].h
	document.getElementById('recubrimiento').value = figuras[figuraActual].d*100
	actualizar()
	varillas = figuras[figuraActual].varillas
	dibujarVarillasActuales(varillas)
	estaGuardada = true
}
function dibujarVarillasActuales(varillas) {
	let as = 0
	for (var i = 0; i < varillas.length; i++) {
		ctx.strokeStyle = 'black'
		ctx.setLineDash([])
		ctx.beginPath()
		let x = varillas[i][1]*mult+margen
		let y = (Math.max(b,h)-varillas[i][2])*mult+margen
		let r = varillas[i][0][1]/2*mult
		ctx.fillText('#' + varillas[i]['n'],x-5,y-r-4)
		ctx.shadowBlur = 3
		ctx.shadowColor = 'black'
		ctx.shadowOffsetX = 3
		ctx.shadowOffsetY = 3
		ctx.arc(x,y,r,0,2*Math.PI)
		ctx.fill()
		ctx.shadowBlur = 0
		ctx.shadowColor = 'black'
		ctx.shadowOffsetX = 0
		ctx.shadowOffsetY = 0
		as += varillas[i][0][0]/10000
	}
	cuantia = as/b/h
	if (cuantia < 0.01 || cuantia > 0.04) {
		ctx.fillStyle = 'red'
		ctx.beginPath()
		let textoCuantia = 'ρ = ' + parseFloat(cuantia).toFixed(4) + ', cuantía fuera del limite'
		ctx.fillText(textoCuantia,10,10)
		ctx.fill()
	} else{
		ctx.beginPath()
		ctx.fillStyle = '#00cd00'
		let textoCuantia = 'ρ = ' + parseFloat(cuantia).toFixed(4)
		ctx.fillText(textoCuantia,10,10)
		ctx.fill()
	}
	ctx.fillStyle = 'black'
}
function settings() {
	var mods = document.querySelectorAll('#modal_3');
	[].forEach.call(mods, function(mod){ mod.checked = true; });
}
function saveSettings() {
	margen = parseFloat(document.getElementById('margen').value)
	presicionDeGrilla = parseFloat(document.getElementById('grilla').value)
	fy = parseFloat(document.getElementById('fy').value)
	ecu = parseFloat(document.getElementById('ecu').value)
	ey = parseFloat(document.getElementById('ey').value)
	fc = parseFloat(document.getElementById('fc').value)
	dibujarViga()
	dibujarVarillasActuales(varillas)
}
var fileInput = document.getElementById("archivo"),
readFile = function () {
var reader = new FileReader();
reader.onload = function () {
var g = reader.result.split("****");
let init = figuras.length
for (var i = 0; i < g.length - 1; i++) {
		let base = parseFloat(g[i].split('\n')[0].split(sepAtributos)[1])
		let altura = parseFloat(g[i].split('\n')[0].split(sepAtributos)[2])
		let recubrimiento = parseFloat(g[i].split('\n')[0].split(sepAtributos)[3])
		let image = g[i].split('\n')[0].split(sepAtributos)[4]
		let varillasPuestas = []
		for (var k = 1; k < g[i].split('\n').length-1; k++) {
			let area = parseFloat(g[i].split('\n')[k].split('===')[0].split(',')[0])
			let diam = parseFloat(g[i].split('\n')[k].split('===')[0].split(',')[1])
			let x = parseFloat(g[i].split('\n')[k].split('===')[1])
			let y = parseFloat(g[i].split('\n')[k].split('===')[2])
			let nuevaVarillaAponer = [[area,diam],x,y]
			nuevaVarillaAponer['n'] = buscarVarillaPorDiametro(diam)
			varillasPuestas.push(nuevaVarillaAponer)
		}
		figuras.push(new ASDI(base,altura,recubrimiento,varillasPuestas,image))
		agregarImagenSeccion2(image,'Col_'+(init+i+1),init+i)
	}
};
reader.readAsBinaryString(fileInput.files[0]);
};
document.getElementById("archivo").addEventListener('change', readFile);

function ptsControl(b,h,dprima,varillas,k) {
	let d = Math.max(b,h)
	let as = 0
	for (var i = 0; i < varillas.length; i++) {
		as += varillas[i][0][0]
		d = Math.min(d, varillas[i][1])
	}
	let compresionPura = (0.85*fc*(b*h-as/10000)+fy*as/10000)
	let cphi = compresionPura*0.75*0.65
	let p1 = [compresionPura,0,0,compresionPura*0.75*0.65,0,0]
	let c2 = ecu*(h-d)/(ecu+ey)
	calcularDeformaciones(c2,b,h,dprima,varillas)
	let phi = calcularPhi(varillas)
	let a = pnominal(c2,b,h,dprima,varillas)
	let p = mnominal(c2,b,h,dprima,varillas)
	let o = a[0]+a[1]+a[2]
	let oo = p[0]+p[1]+p[2]
	let p2 = [o,oo*k,0, o*phi<cphi ? o*phi : cphi,oo*k*phi,0]
	let c3 = ecu*(h-d)/(ecu+0.005)
	calcularDeformaciones(c3,b,h,dprima,varillas)
	phi = calcularPhi(varillas)
	a = pnominal(c3,b,h,dprima,varillas)
	p = mnominal(c3,b,h,dprima,varillas)
	o = a[0]+a[1]+a[2]
	oo = p[0]+p[1]+p[2]
	let p3 = [o,oo*k,0, o*phi<cphi ? o*phi : cphi,oo*k*phi,0]
	let c4 = encontrarCVIGA(b,h,dprima,varillas)
	calcularDeformaciones(c4,b,h,dprima,varillas)
	phi = calcularPhi(varillas)
	a = pnominal(c4,b,h,dprima,varillas)
	p = mnominal(c4,b,h,dprima,varillas)
	o = a[0]+a[1]+a[2]
	oo = p[0]+p[1]+p[2]
	let p4 = [o,oo*k,0, o*phi<cphi ? o*phi : cphi,oo*k*phi,0]
	let p5 = [-fy*as/10000,0,0,-fy*as/10000*0.9,0,0]
	return [p1,p2,p3,p4,p5]
}

function encontrarCVIGA(b,h,dprima,varillas) {
	let x0 = 0.000001
	let xf = h
	let xr = (xf +x0)/2
	for (var i = 0; i < 100; i++) {
		let fx0 = cargaAxial(x0,b,h,dprima,varillas)
		let fxf = cargaAxial(xf,b,h,dprima,varillas)
		xr = (xf +x0)/2
		let fxr = cargaAxial(xr,b,h,dprima,varillas)
		if (fx0*fxr > 0) {
			x0 = xr
			xf = xf
		} else {
			x0 = x0
			xf = xr
		}
	}
	return xr
}
function cargaAxial(c,b,h,dprima,varillas) {
	calcularDeformaciones(c,b,h,dprima,varillas)
	let a = pnominal(c,b,h,dprima,varillas)
	return c = a[0]+a[1]+a[2] 
}
function descargarTodasLasFiguras() {
	for (var i = 0; i < figuras.length; i++) {
		descargarResultadosFigura(i)
	}
}
function descargarResultadosFigura(i) {
	figuraActual = i
	document.getElementById('base').value = figuras[figuraActual].b
	document.getElementById('altura').value = figuras[figuraActual].h
	document.getElementById('recubrimiento').value = figuras[figuraActual].d*100
	varillas = figuras[figuraActual].varillas
	
	setTimeout(function(){didi(100,b,h,varillas,dprima);Plotly.downloadImage('graficas', {format: 'png', width: 800, height: 600, filename: 'Col_' + (i+1) + 'X+'})}, 2000);
	setTimeout(function(){didi(100,b,h,varillas,dprima);Plotly.downloadImage('graficas2', {format: 'png', width: 800, height: 600, filename: 'Col_' + (i+1) + 'X-'})}, 2000);
	setTimeout(function(){didi(100,b,h,varillas,dprima);Plotly.downloadImage('graficas3', {format: 'png', width: 800, height: 600, filename: 'Col_' + (i+1) + 'Y+'})}, 2000);
	setTimeout(function(){didi(100,b,h,varillas,dprima);Plotly.downloadImage('graficas4', {format: 'png', width: 800, height: 600, filename: 'Col_' + (i+1) + 'Y-'})}, 2000);
}
var datosMomento = []
var combos = []
var puntosDeEvaluacion = []
$(document).ready(function(){
      $("#puntosAEvaluar").change(function(evt){
            var selectedFile = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = function(event) {
              var data = event.target.result;
              var workbook = XLSX.read(data, {
                  type: 'binary'
              });
              datosMomento = []
              combos = []
              puntosDeEvaluacion = []
              workbook.SheetNames.forEach(function(sheetName) {
                  var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                  combos.push(sheetName)
                  datosMomento.push(XL_row_object)
                })
              arreglarDatos()
              graficarPuntos()
              document.getElementById('puntosAEvaluar').value = ''
            };
            reader.onerror = function(event) {
              console.error("File could not be read! Code " + event.target.error.code);
            };
            reader.readAsBinaryString(selectedFile);
      });
});
function arreglarDatos() {
	for (var i = 0; i < datosMomento.length; i++) {
		let p = []
		let m2 = []
		let m3 = []
		let mm2 = []
		let mm3 = []
		puntosDeEvaluacion[combos[i]] = []
		datosMomento[i].forEach((e) => {
			p.push(e['P']*-1)
			m2.push(Math.abs(e['M2']))
			m3.push(Math.abs(e['M3']))
			mm2.push(Math.abs(e['M2'])*-1)
			mm3.push(Math.abs(e['M3'])*-1)
		})
		puntosDeEvaluacion[combos[i]] = [p,m2,m3,mm2,mm3]
	}
}
function graficarPuntos() {
	let traces1 = []
	let traces2 = []
	let traces3 = []
	let traces4 = []
	let traces5= []
	for (var i = 0; i < combos.length; i++) {
		let trace1 = {
			x: puntosDeEvaluacion[combos[i]][2],
			y: puntosDeEvaluacion[combos[i]][0],
			mode: 'markers',
	  		type: 'scatter',
			name: combos[i]
		}
		let trace2 = {
			x: puntosDeEvaluacion[combos[i]][4],
			y: puntosDeEvaluacion[combos[i]][0],
			mode: 'markers',
	  		type: 'scatter',
			name: combos[i]
		}
		let trace3 = {
			x: puntosDeEvaluacion[combos[i]][1],
			y: puntosDeEvaluacion[combos[i]][0],
			mode: 'markers',
	  		type: 'scatter',
			name: combos[i]
		}
		let trace4 = {
			x: puntosDeEvaluacion[combos[i]][3],
			y: puntosDeEvaluacion[combos[i]][0],
			mode: 'markers',
	  		type: 'scatter',
			name: combos[i]
		}
		let trace5 = {
			y: puntosDeEvaluacion[combos[i]][1].concat(puntosDeEvaluacion[combos[i]][3]).concat(puntosDeEvaluacion[combos[i]][1].concat(puntosDeEvaluacion[combos[i]][3])),
			x: puntosDeEvaluacion[combos[i]][2].concat(puntosDeEvaluacion[combos[i]][4]).concat(puntosDeEvaluacion[combos[i]][4].concat(puntosDeEvaluacion[combos[i]][2])),
			z: puntosDeEvaluacion[combos[i]][0].concat(puntosDeEvaluacion[combos[i]][0]).concat(puntosDeEvaluacion[combos[i]][0].concat(puntosDeEvaluacion[combos[i]][0])),
			mode: 'markers',
	  		type: 'scatter3d',
			name: combos[i]
		}
		traces1.push(trace1)
		traces2.push(trace2)
		traces3.push(trace3)
		traces4.push(trace4)
		traces5.push(trace5)
	}
	Plotly.addTraces('graficas', traces1)
	Plotly.addTraces('graficas2', traces2)
	Plotly.addTraces('graficas3', traces3)
	Plotly.addTraces('graficas4', traces4)
	Plotly.addTraces('graficas5', traces5)
}
function drawPtos(name,x,y,grafica) {
	let trace = {
		x: x,
		y: y,
		mode: 'markers',
  		type: 'scatter',
		name: name
	}
	Plotly.addTraces(grafica, [trace]);
}
function soyDasus(b,h,dprima,varillas) {
	let c4 = encontrarCVIGA(b,h,dprima,varillas)
	calcularDeformaciones(c4,b,h,dprima,varillas)
	let phi = calcularPhi(varillas)
	let a = pnominal(c4,b,h,dprima,varillas)
	let p = mnominal(c4,b,h,dprima,varillas)
	return ['Momento Nominal: ' + (p[0]+p[1]+p[2]),'Momento Nominal con phi: ' + ((p[0]+p[1]+p[2])*phi), 'Phi: ' + phi, 'C: ' + c4]
}