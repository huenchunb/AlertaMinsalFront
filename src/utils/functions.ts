export const isValidRUT = (rut: string): boolean => {
    rut = rut.replace(/\./g, '').replace(/-/g, '');

    // Validar formato
    if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) {
        return false;
    }

    // Separar cuerpo y dígito verificador
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    // Calcular dígito verificador
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    const dnAsNumber = dv === 'K' ? 10 : dv === '0' ? 11 : parseInt(dv);

    return dnAsNumber === dvEsperado; // Cambia esto por la lógica real
};