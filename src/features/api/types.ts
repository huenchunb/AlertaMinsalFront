export interface PaginatedList<T> {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface LoginRequestBody {
    email: string
    password: string
}

export interface LookupDto {
    id: number,
    name: string
}

export interface RoleDto {
    id: string,
    name: string
}

export interface EmpleadoDto {
    id: number;
    rutNormalized: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    address: string;
    streetNumber: string;
    comuna: string;
    region: string;
    imageUrl: string;
    mutualidad: string;
    estamento: string;
    establecimiento: string;
}

export interface CreateEmpleadoRequestBody {
    rut: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    address: string;
    streetNumber: string;
    comunaId: number;
    mutualidadId: number;
    estamentoId: number;
    establecimientoId: number;
    imageUrl: string;
    role: string;
}

export interface TipoAgresionCategoriaDto {
    id: number;
    name: string;
    tipoAgresionId: number;
}

export interface EmpleadoDefaultDto {
    id: number;
    fullName: string;
    establecimientoId: number;
}

export interface GetDefaultsResponseDto {
    mutualidades: LookupDto[];
    estamentos: LookupDto[];
    establecimientos: LookupDto[];
    comunas: LookupDto[];
    tipoAgresores: LookupDto[];
    tipoAgresiones: LookupDto[];
    tipoAgresionesCategorias: TipoAgresionCategoriaDto[];
    empleados: EmpleadoDefaultDto[]
    roles: RoleDto[];
}

export interface CreateAgresionCommand {
    fechaAgresion: string;
    empleadoId: number;
    categoriasAgresionesId: number[];
    agresores: AgresorCreateDto[];
    testigos: TestigoCreateDto[];
}

export interface AgresorCreateDto {
    tipoAgresorId: number;
    rut: string;
    name: string | null;
    lastName: string | null;
    address: string | null;
    comunaId: number | null;
}

export interface TestigoCreateDto {
    rut: string;
    name: string;
    lastName: string;
    email: string;
    address: string;
}

export interface AgresionGeoLocationDto {
    id: number;
    name: string;
    longitude: number;
    latitude: number;
    agresionConArmaFuego: number;
    agresionesConArmaBlanca: number;
    agresionesConObjetoContundente: number;
    agresionesSexualesTocaciones: number;
    agresionesEmpujonesCombos: number;
    agresionesOtro: number;
    agresionesInfraestructura: number;
    agresionesSexualesLenguaje: number;
    agresionesAmenazas: number;
    agresionesInsultos: number;
    agresionesBurlas: number;
    agresionesRedesSociales: number;
    agresionesOtroVerbal: number;
    totalAgresionesFisicas: number;
    totalAgresionesVerbales: number;
}

export interface EstablecimientoDto {
    id: number;
    name: string;
    tipo: string;
    nivel: string;
    address: string;
    streetNumber: string;
    phoneNumber: number;
    urgency: boolean;
    tipoUrgencia: string;
    longitude: number;
    latitude: number;
    complejidad: string;
    tipoAtencion: string;
    comuna: string;
    region: string;
}

export interface AgresionesCountByCategories {
    id: number;
    name: string;
    tipoAgresionId: number;
    totalAgresiones: number;
}

export interface GetAggressionSummaryByDate {
    date: string;
    physicalAggressions: number;
    verbalAggressions: number;
}