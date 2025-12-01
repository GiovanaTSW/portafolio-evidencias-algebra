// Clase para manejar números complejos
class NumeroComplejo {
    constructor(real, imag = 0) {
        this.real = real;
        this.imag = imag;
    }

    sumar(otro) {
        return new NumeroComplejo(this.real + otro.real, this.imag + otro.imag);
    }

    multiplicar(otro) {
        return new NumeroComplejo(
            this.real * otro.real - this.imag * otro.imag,
            this.real * otro.imag + this.imag * otro.real
        );
    }

    toString() {
        if (this.imag === 0) return this.real.toFixed(4).replace(/\.?0+$/, '');
        const realStr = this.real.toFixed(4).replace(/\.?0+$/, '');
        const imagStr = Math.abs(this.imag).toFixed(4).replace(/\.?0+$/, '');
        if (this.real === 0) return `${imagStr}i`;
        const signo = this.imag >= 0 ? '+' : '-';
        return `${realStr}${signo}${imagStr}i`;
    }

    esReal() {
        return Math.abs(this.imag) < 1e-10;
    }
}

// Función para parsear un polinomio
function parsearPolinomio(str) {
    str = str.trim().replace(/\s/g, '');
    const gradoMatch = str.match(/x\^(\d+)/g);
    let gradoMax = gradoMatch ? Math.max(...gradoMatch.map(m => parseInt(m.match(/\d+/)[0]))) : (str.includes('x') ? 1 : 0);
    const coeficientes = new Array(gradoMax + 1).fill(null).map(() => new NumeroComplejo(0));
    str = str.replace(/([+-])\s*x/g, '$1 1x').replace(/^x/, '1x');
    const terminos = str.match(/[+-]?[^+-]+/g) || [];
    for (let termino of terminos) {
        termino = termino.trim();
        if (!termino) continue;
        let coef, grado;
        if (!termino.includes('x')) {
            coef = parsearComplejo(termino); grado = 0;
        } else if (termino.includes('x^')) {
            const partes = termino.split('x^');
            coef = partes[0] === '' || partes[0] === '+' ? new NumeroComplejo(1) : partes[0] === '-' ? new NumeroComplejo(-1) : parsearComplejo(partes[0]);
            grado = parseInt(partes[1]);
        } else {
            const partes = termino.split('x');
            coef = partes[0] === '' || partes[0] === '+' ? new NumeroComplejo(1) : partes[0] === '-' ? new NumeroComplejo(-1) : parsearComplejo(partes[0]);
            grado = 1;
        }
        const indice = gradoMax - grado;
        coeficientes[indice] = coeficientes[indice].sumar(coef);
    }
    return coeficientes;
}

// Parsear números complejos
function parsearComplejo(str) {
    str = str.trim().replace(/\s/g, '');
    if (!str.includes('i')) return new NumeroComplejo(parseFloat(str));
    str = str.replace(/i/g, '');
    let real = 0, imag = 0;
    if (str.indexOf('+') > 0 || (str.indexOf('-') > 0 && str.indexOf('-') !== 0)) {
        const partes = str.split(/(?=[+-])/);
        real = parseFloat(partes[0]) || 0;
        imag = parseFloat(partes[1]) || 1;
    } else imag = parseFloat(str) || 1;
    return new NumeroComplejo(real, imag);
}

// División sintética
function divisionSintetica(coeficientes, raiz) {
    const n = coeficientes.length;
    const proceso = [ [...coeficientes], [new NumeroComplejo(0)] ];
    const resultado = [coeficientes[0]];
    for (let i = 1; i < n; i++) {
        const producto = resultado[i - 1].multiplicar(raiz);
        proceso[1].push(producto);
        resultado.push(coeficientes[i].sumar(producto));
    }
    return { proceso, resultado, cociente: resultado.slice(0, -1), residuo: resultado[resultado.length - 1] };
}

// Mostrar resultado
function mostrarResultado(resultado, coeficientes, raiz, polinomioOriginal) {
    let html = `<div class="result-title">Polinomio Original</div>
        <div style="text-align:center;font-size:1.2em;margin-bottom:20px;padding:15px;background:white;border:1px solid #e0e0e0;border-radius:4px;">
        <strong>${polinomioOriginal}</strong></div>
        <div class="result-title">Coeficientes Extraídos</div><table class="process-table"><tr>`;
    coeficientes.forEach((_, i) => {
        const exp = coeficientes.length - 1 - i;
        html += `<td><strong>${exp === 0 ? 'Término independiente' : exp === 1 ? 'x' : 'x<sup>' + exp + '</sup>'}</strong></td>`;
    });
    html += `</tr><tr>${coeficientes.map(c => `<td>${c.toString()}</td>`).join('')}</tr></table>`;
    html += `<div class="result-title">Proceso de División Sintética</div><table class="process-table">
        <tr><td class="divisor-cell">Divisor: ${raiz.toString()}</td>${coeficientes.map(c => `<td>${c.toString()}</td>`).join('')}</tr>
        <tr><td class="divisor-cell">Multiplicar y bajar</td>${resultado.proceso[1].map(p => `<td>${p.toString()}</td>`).join('')}</tr>
        <tr><td class="divisor-cell">Resultado (sumar)</td>${resultado.resultado.map(r => `<td>${r.toString()}</td>`).join('')}</tr>
        </table><div class="final-result"><p><strong>Cociente:</strong> `;
    let cocienteStr = '';
    resultado.cociente.forEach((coef, i) => {
        const exp = resultado.cociente.length - 1 - i;
        if (coef.real !== 0 || coef.imag !== 0) {
            if (cocienteStr && (coef.real > 0 || (coef.real === 0 && coef.imag > 0))) cocienteStr += ' + ';
            cocienteStr += `(${coef.toString()})`;
            if (exp > 0) cocienteStr += `x${exp > 1 ? '<sup>' + exp + '</sup>' : ''}`;
        }
    });
    html += cocienteStr || '0';
    html += `</p><p><strong>Residuo:</strong> ${resultado.residuo.toString()}</p>`;
    if (resultado.residuo.esReal() && Math.abs(resultado.residuo.real) < 1e-10)
        html += `<p style="color:#333;font-weight:600;">✓ La división es exacta (residuo = 0)</p>`;
    html += `</div>`;
    document.getElementById('resultado').innerHTML = html;
    document.getElementById('resultado').classList.add('show');
}

// Función principal
function calcularDivision() {
    try {
        const polinomioStr = document.getElementById('polinomio').value;
        const raizStr = document.getElementById('raiz').value;
        if (!polinomioStr || !raizStr) throw new Error('Por favor ingresa todos los datos');
        const coeficientes = parsearPolinomio(polinomioStr);
        const raiz = parsearComplejo(raizStr);
        const resultado = divisionSintetica(coeficientes, raiz);
        mostrarResultado(resultado, coeficientes, raiz, polinomioStr);
    } catch (error) {
        document.getElementById('resultado').innerHTML = `<div class="error"><strong>Error:</strong> ${error.message}</div>`;
        document.getElementById('resultado').classList.add('show');
    }
}