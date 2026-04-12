export const plantKeys = {
  all: ['plantas'] as const,
  detail: (id: number) => ['plantas', 'detail', id] as const,
};

export const cuidadoApexKeys = {
  all: ['cuidados-apex'] as const,
};
