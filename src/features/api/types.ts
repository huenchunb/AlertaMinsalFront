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
}

export interface GetDefaultsResponseDto {
    mutualidades: LookupDto[];
    estamentos: LookupDto[];
    establecimientos: LookupDto[];
    comunas: LookupDto[];
}