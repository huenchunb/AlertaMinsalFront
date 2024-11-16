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