export interface PaginatedList<T> {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface LoginResponseBody {
    tokenType: string;
    accessToken: string;
    expiresIn: string;
    refreshToken: string;
}

export interface LookupDto {
    id: number;
    name: string;
}

export interface RoleDto {
    id: string;
    name: string;
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
    establecimientoId: number;
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
    tipoEstablecimiento: LookupDto[];
    nivelEstablecimiento: LookupDto[];
    complejidadesEstablecimiento: LookupDto[];
    tipoAtencionEstablecimiento: LookupDto[];
    tipoUrgenciaEstablecimiento: LookupDto[];
    tipoAgresionesCategorias: TipoAgresionCategoriaDto[];
    empleados: EmpleadoDefaultDto[];
    roles: RoleDto[];
}

export interface ApproveAggressionCommand {
    id: number;
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

export interface AggressionDto {
    agresionId: number;
    estadoAgresion: string;
    fechaAgresion: string;
    fechaAgresionNormalizada: string;
    empleado: AgresionEmpleadoDto;
    establecimiento: AgresionEstablecimientoDto;
    creadoPor?: string;
    actualizadoPor?: string;
    fechaCreacion: Date;
    fechaCreacionNormalizada: string;
    fechaActualizacion: Date;
    fechaActualizacionNormalizada: string;
    tipoAgresion?: string;
    categoriasAgresion: string[];
    agresores: AgresionAgresorDto[];
    testigos: AgresionTestigoDto[];
}

export interface AgresionEmpleadoDto {
    id: number;
    fullName: string;
    rutNormalized: string;
    email: string;
    phoneNumber: number;
    comuna: string;
    region: string;
}

export interface AgresionEstablecimientoDto {
    id: number;
    name: string;
    address: string;
    comuna: string;
    region: string;
}

export interface AgresionAgresorDto {
    id: number;
    comuna?: string;
    digito?: string;
    direccion?: string;
    fullName?: string;
    lastName?: string;
    name?: string;
    rut?: string;
    rutNormalized?: string;
}

export interface AgresionTestigoDto {
    digito: string;
    email: string;
    fullName: string;
    id: number;
    lastName: string;
    name: string;
    phoneNumber: number;
    rut: string;
    rutNormalized: string;
}

export interface EstablishmentSummaryDto {
    name: string;
    quantity: number;
}

export interface GetAggresionsSummaryResponseDto {
    attacksReported: number;
    approvedAttacks: number;
    physicalEstablishment: EstablishmentSummaryDto;
    verbalEstablishment: EstablishmentSummaryDto;
}


export interface CreateEstablishmentCommand {
    code: number;
    name: string;
    tipoEstablecimientoId: number;
    nivelEstablecimientoId: number;
    address: string;
    streetNumber: string;
    phoneNumber: number;
    urgency: boolean;
    tipoUrgenciaEstablecimientoId: number;
    longitude: number;
    latitude: number;
    complejidadEstablecimientoId: number;
    tipoAtencionEstablecimientoId: number;
    comunaId: number;
}

export interface UserInfoResponse {
    email: string,
    isEmailConfirmed: boolean;
}

export interface GetEmpleadoQuery {
    pageNumber: number;
    pageSize: number;
    establecimientoId?: number | null | undefined;
}

export interface GetAggressionsQuery {
    pageNumber: number;
    pageSize: number;
    establecimientoId?: number | null | undefined;
}