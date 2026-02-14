# Análise Completa do Projeto ClickEstilo

**Data da Análise:** Fevereiro 2025  
**Versão do Projeto:** api-barbershop + app-barbershop  
**Objetivo:** Identificar ajustes, correções e implementações necessárias para funcionamento 100%

---

## Sumário

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Problemas de Alta Prioridade](#problemas-de-alta-prioridade)
3. [Problemas de Média Prioridade](#problemas-de-média-prioridade)
4. [Problemas de Baixa Prioridade](#problemas-de-baixa-prioridade)
5. [Inconsistências Frontend ↔ Backend](#inconsistências-frontend--backend)
6. [Validações Zod vs Backend](#validações-zod-vs-backend)
7. [Relacionamentos e Integridade de Dados](#relacionamentos-e-integridade-de-dados)
8. [Autenticação e Autorização](#autenticação-e-autorização)
9. [Documentos e Formatos (CNPJ, Telefone)](#documentos-e-formatos-cnpj-telefone)
10. [Recomendações de Correção](#recomendações-de-correção)
11. [Dependências entre Correções](#dependências-entre-correções)

---

## Visão Geral do Projeto

### Estrutura do Backend (api-barbershop)

| Módulo | Entidade Principal | Relacionamentos |
|--------|-------------------|-----------------|
| **auth** | User | Company |
| **companies** | Company | Users, Customers, Professionals, Services, Channels, Sales |
| **customers** | Customer | Company, Professional (preferido), Schedules |
| **professionals** | Professional | Company, Schedules, Services |
| **services** | Service | Company, Schedules, ProfessionalServices |
| **schedules** | Schedule | Company, Customer, Professional, Service |
| **sales** | Sale | Company, Customer, Professional, SaleItems |
| **payments** | Schedule (via paymentCorrelationId) | Company, Schedule |
| **products** | Product | Company |
| **ai-agent** | AiAgent | Company, Channels |

### Estrutura do Frontend (app-barbershop)

- **Framework:** Next.js 14+ com App Router
- **Gerenciamento de Estado:** Context API (AuthContext, OnboardingContext)
- **Validações:** Zod + React Hook Form
- **Estilização:** Tailwind CSS + Componentes customizados
- **Comunicação com API:** Axios com interceptors

---

## Problemas de Alta Prioridade

### 1. Incompatibilidade de Tipos de ID entre Frontend e Backend

**Arquivo:** `app-barbershop/src/types/index.ts` (múltiplas linhas)

**Problema:** Os IDs são definidos como `string` no frontend, mas são `number` no backend.

```typescript
// Frontend - types/index.ts
export interface Customer {
  id: string;  // ❌ Deveria ser number
  // ...
}

export interface Professional {
  id: string;  // ❌ Deveria ser number
  // ...
}

export interface Service {
  id: string;  // ❌ Deveria ser number
  // ...
}
```

**Impacto:** Pode causar problemas de parsing, comparações incorretas e falhas em requisições.

**Correção Sugerida:**
```typescript
export interface Customer {
  id: number;  // ✓ Correto
  // ...
}
```

**Arquivos Afetados:**
- `/root/clawd/workspace/clickestilo/app-barbershop/src/types/index.ts` (todas as interfaces de entidades)

---

### 2. Campos Obligatórios Ausentes no Backend

**Arquivo:** `api-barbershop/src/services/dto/create-service.dto.ts`

**Problema:** O DTO de criação de serviço não possui validações completas e não inclui todos os campos necessários.

```typescript
// Backend - create-service.dto.ts
export class CreateServiceDto {
  @ApiProperty({ description: 'Nome do serviço', example: 'Corte de Cabelo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descrição detalhada do serviço', ... })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Preço do serviço em Reais', example: 50.0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Duração do serviço em minutos', example: 30 })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Taxa de agendamento (opcional)...', required: false })
  @IsNumber()
  @Min(0)
  bookingFee?: number;
  // ❌ Falta companyId - deveria ser obtido do usuário autenticado
}
```

**Impacto:** O campo `companyId` deveria ser obtido do contexto de autenticação, mas há inconsistência na forma como é tratado.

**Correção Sugerida:** Garantir que todos os controllers usem `@GetUser()` para obter o companyId do token JWT.

---

### 3. Validação de CNPJ Inadequada

**Arquivo:** `api-barbershop/src/companies/dto/create-company.dto.ts`

**Problema:** O DTO não valida o formato do CNPJ, apenas verifica se não está vazio.

```typescript
export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  document: string; // CNPJ - ❌ Sem validação de formato

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
```

**Impacto:** CNPJs inválidos podem ser cadastrados no sistema.

**Correção Sugerida:**
```typescript
import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class CreateCompanyDto {
  // ...outros campos...

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos numéricos' })
  document: string;
}
```

---

### 4. Conversão de Tipos Incorreta no Frontend

**Arquivo:** `app-barbershop/src/components/ScheduleModal.tsx`

**Problema:** Os IDs são convertidos para `string` antes de enviar para a API, mas a API espera `number`.

```typescript
// Frontend - ScheduleModal.tsx (linha ~140)
const scheduleData = {
  customerId: data.customerId,        // ❌ string, deveria ser number
  professionalId: data.professionalId, // ❌ string, deveria ser number
  serviceId: data.serviceId,          // ❌ string, deveria ser number
  scheduleDate: scheduleDateISO,
  status: data.status,
};
```

**Impacto:** O backend pode rejeitar requisições com IDs em formato incorreto.

**Correção Sugerida:**
```typescript
const scheduleData = {
  customerId: Number(data.customerId),
  professionalId: Number(data.professionalId),
  serviceId: Number(data.serviceId),
  scheduleDate: scheduleDateISO,
  status: data.status,
};
```

---

### 5. Falta de Validação de Telefone no Backend

**Arquivo:** `api-barbershop/src/customers/dto/create-customer.dto.ts`

**Problema:** O telefone não possui validação de formato, permitindo valores inválidos.

```typescript
export class CreateCustomerDto {
  @ApiProperty({ description: 'Nome do cliente', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Telefone do cliente (preferencialmente WhatsApp)', example: '5511999998888' })
  @IsString()
  @IsNotEmpty()
  phone: string;  // ❌ Sem validação de formato
}
```

**Impacto:** Telefones mal formatados podem ser armazenados, causando problemas no envio de mensagens WhatsApp.

**Correção Sugerida:**
```typescript
import { IsString, IsNotEmpty, Matches, IsOptional, IsObject, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  // ...
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,15}$/, { message: 'Telefone deve conter entre 10 e 15 dígitos' })
  phone: string;
}
```

---

## Problemas de Média Prioridade

### 6. Inconsistência no Campo `totalSpent` do Customer

**Arquivo:** `api-barberbarbershop/src/customers/entities/customer.entity.ts`

**Problema:** O campo `totalSpent` não está sendo atualizado quando uma venda ou agendamento é criado.

```typescript
// Backend - customer.entity.ts
@Column({
  type: 'decimal',
  precision: 10,
  scale: 2,
  default: 0,
  transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value),
  },
  comment: 'Total gasto pelo cliente'
})
totalSpent: number;
```

**Problema:** Não há lógica no SalesService ou SchedulesService para atualizar este campo quando um pagamento é confirmado.

**Correção Sugerida:** Adicionar lógica de atualização no método `handleWebhook` do PaymentsService:

```typescript
// payments.service.ts
if (schedule) {
  // Atualizar status do agendamento
  await this.schedulesService.update(/* ... */);
  
  // Atualizar totalSpent do cliente
  const totalAmount = schedule.service.price + (schedule.service.bookingFee || 0);
  await this.customersService.updateTotalSpent(schedule.customerId, totalAmount);
}
```

---

### 7. Validação de Gender Inconsistente

**Arquivo:** `api-barbershop/src/customers/entities/customer.entity.ts`

**Problema:** O campo `gender` é uma string livre sem validação de valores permitidos.

```typescript
@Column({
  type: 'varchar',
  length: 20,
  nullable: true,
  comment: 'Gênero',
})
gender: string | null;  // ❌ Sem enum definido
```

**Impacto:** Valores inconsistentes podem ser armazenados (ex: "M", "masculino", "Male", "H", etc.).

**Correção Sugerida:**
```typescript
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

@Entity({ name: 'cliente_gdb_customers' })
@Index(['phone', 'companyId'], { unique: true })
export class Customer {
  // ...
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
    comment: 'Gênero',
  })
  gender: Gender | null;
}
```

---

### 8. Status de Schedule Não Atualiza Automaticamente

**Arquivo:** `api-barbershop/src/schedules/schedules.service.ts`

**Problema:** Não há lógica para atualizar automaticamente o status do agendamento quando a data passa.

```typescript
// Backend - schedules.service.ts
// ❌ Falta lógica de atualização automática de status
```

**Impacto:** Agendamentos passam de "PENDING" ou "CONFIRMED" para expirados sem intervenção.

**Correção Sugerida:** Adicionar um cron job ou método manual para atualizar status:
```typescript
// Adicionar no schedules.service.ts
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async updateExpiredSchedules() {
  const expiredSchedules = await this.scheduleRepository
    .createQueryBuilder('schedule')
    .where('schedule.scheduleDate < :now', { now: new Date() })
    .andWhere('schedule.status IN (:...statuses)', { 
      statuses: [ScheduleStatus.PENDING, ScheduleStatus.CONFIRMED] 
    })
    .getMany();

  for (const schedule of expiredSchedules) {
    await this.scheduleRepository.update(schedule.id, {
      status: ScheduleStatus.COMPLETED
    });
  }
}
```

---

### 9. Falta de Validação de Dependências na Exclusão

**Arquivo:** `api-barbershop/src/professionals/professionals.service.ts`

**Problema:** Ao excluir um profissional, não há validação se existem agendamentos vinculados.

```typescript
async remove(id: number, companyId: number): Promise<void> {
  const professional = await this.findOne(id, companyId);
  const result = await this.professionalRepository.delete(professional.id);
  // ❌ Não verifica se há schedules vinculados
}
```

**Impacto:** Pode causar quebra de integridade referencial e erros ao tentar carregar agendamentos com profissionais inexistentes.

**Correção Sugerida:**
```typescript
async remove(id: number, companyId: number): Promise<void> {
  const professional = await this.findOne(id, companyId);

  // Verificar agendamentos ativos
  const activeSchedules = await this.scheduleRepository.count({
    where: {
      professionalId: id,
      status: ScheduleStatus.PENDING,
    },
  });

  if (activeSchedules > 0) {
    throw new BadRequestException(
      'Não é possível excluir este profissional pois existem agendamentos pendentes vinculados.'
    );
  }

  const result = await this.professionalRepository.delete(professional.id);
  // ...
}
```

---

### 10. Tratamento de Erros Inconsistente no Frontend

**Arquivo:** `app-barbershop/src/services/api.ts`

**Problema:** O tratamento de erros não padroniza as mensagens de erro para o usuário.

```typescript
// Frontend - api.ts
async login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await this.api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.response?.status === 401) {
      throw new Error('Email ou senha incorretos');
    } else if (apiError.code === 'ECONNREFUSED' || apiError.code === 'ERR_NETWORK') {
      throw new Error('Servidor não está disponível. Verifique se o backend está rodando.');
    } else {
      throw new Error(apiError.response?.data?.message || 'Erro ao fazer login');
    }
  }
}
```

**Problema:** Nem todos os métodos de API têm tratamento de erro consistente.

**Correção Sugerida:** Criar um interceptor de erros global:

```typescript
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Tratamento padronizado de erros
//     if (error.response?.status === 401) {
//       logout();
//       redirect('/login');
//     }
//     return Promise.reject(error);
//   }
// );
```

---

## Problemas de Baixa Prioridade

### 11. Documentação de API Incompleta

**Observação:** Alguns endpoints não possuem documentação Swagger adequada.

**Arquivos Afetados:**
- `api-barbershop/src/schedules/schedules.controller.ts`
- `api-barbershop/src/sales/sales.controller.ts`

**Correção Sugerida:** Adicionar decorators `@ApiOperation`, `@ApiResponse` e `@ApiProperty` em todos os endpoints.

---

### 12. Logs de Debug Excessivos em Produção

**Arquivo:** `api-barbershop/src/auth/auth.service.ts`

**Problema:** Há logs de debug que expõem informações sensíveis (senhas hasheadas).

```typescript
async validateUser(email: string, pass: string): Promise<any> {
  const user = await this.usersService.findByEmailWithPassword(email);

  if (user && user.password) {
    console.log('--- INÍCIO DA VALIDAÇÃO DE SENHA ---');
    console.log('Validando para o email:', email);
    console.log('Senha recebida:', `'${pass}'`);  // ⚠️ Sensível
    console.log('Tamanho da senha recebida:', pass.length);
    console.log('Hash do banco:', user.password);  // ⚠️ Sensível
    // ...
  }
}
```

**Correção Sugerida:** Remover ou desabilitar logs de debug em produção.

---

### 13. Formatação de Preço Inconsistente

**Arquivo:** `app-barbershop/src/components/ScheduleModal.tsx`

**Problema:** O valor total é calculado manualmente sem usar a função utilitária `formatPrice`.

```typescript
// Frontend - ScheduleModal.tsx
const calculateTotalValue = () => {
  if (!selectedService) return 0;
  const servicePrice = typeof selectedService.price === 'string'
    ? parseFloat(selectedService.price)
    : selectedService.price;
  const bookingFee = selectedService.bookingFee
    ? (typeof selectedService.bookingFee === 'string'
        ? parseFloat(selectedService.bookingFee)
        : selectedService.bookingFee)
    : 0;
  return servicePrice + bookingFee;  // ❌ Não formata para exibir
};
```

**Correção Sugerida:** Usar a função utilitária para exibir o valor:

```typescript
return formatPrice(servicePrice + bookingFee);
```

---

### 14. Enum de PaymentMethod Inconsistente

**Arquivo:** `api-barbershop/src/sales/entities/sale.entity.ts`

**Problema:** Os valores do enum não estão padronizados com o frontend.

```typescript
// Backend - sale.entity.ts
export enum PaymentMethod {
  PIX = 'PIX',
  CARD = 'CARD',
  CASH = 'CASH',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
}
```

```typescript
// Frontend - types/index.ts
export interface Sale {
  // ...
  paymentMethod: 'PIX' | 'CARD' | 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD';
  // ...
}
```

**Problema:** Os valores `DEBIT_CARD` e `CREDIT_CARD` podem causar confusão. O frontend mistura com `CARD`.

**Correção Sugerida:** Padronizar os valores ou documentar a diferença.

---

### 15. Limite de Paginação Não Validado

**Arquivo:** `api-barbershop/src/customers/customers.service.ts`

```typescript
async findAll(
  companyId: number,
  page = 1,
  limit = 20,
): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
  const take = Math.max(1, Math.min(limit, 100));  // ✓ Limitado a 100
  const skip = (Math.max(page, 1) - 1) * take;
  // ...
}
```

**Problema:** Embora o limite esteja correto, nem todos os endpoints têm esta validação.

**Correção Sugerida:** Aplicar a mesma lógica em todos os endpoints de paginação.

---

## Inconsistências Frontend ↔ Backend

### Tabela de Comparação de Tipos

| Entidade | Backend (TypeScript) | Frontend (TypeScript) | Status |
|----------|---------------------|----------------------|--------|
| **Customer.id** | `number` | `string` | ❌ Incompatível |
| **Customer.phone** | `string` | `string` | ✅ OK |
| **Customer.email** | `string \| null` | `string \| undefined` | ⚠️ Diferença |
| **Professional.id** | `number` | `string` | ❌ Incompatível |
| **Professional.commissionType** | `'PERCENTAGE' \| 'FIXED' \| null` | `'PERCENTAGE' \| 'FIXED'` | ⚠️ Diferença |
| **Service.id** | `number` | `string` | ❌ Incompatível |
| **Service.price** | `number` | `number \| string` | ⚠️ Diferença |
| **Schedule.id** | `number` | `string` | ❌ Incompatível |
| **Schedule.status** | `ScheduleStatus` enum | `'PENDING' \| 'CONFIRMED' \| ...'` | ⚠️ Diferença |
| **Sale.paymentMethod** | `PaymentMethod` enum | `'PIX' \| 'CARD' \| ...'` | ⚠️ Diferença |

---

## Validações Zod vs Backend

### Tabela de Comparação de Validações

| Campo | Backend (class-validator) | Frontend (Zod) | Status |
|-------|--------------------------|-----------------|--------|
| **email** | `@IsEmail()` | `z.string().email()` | ✅ OK |
| **password** | `@MinLength(6)` | `z.string().min(6)` | ✅ OK |
| **phone** | `@IsNotEmpty()` | `z.string().min(1)` | ⚠️ Backend fraco |
| **document** | `@IsNotEmpty()` | `z.string().min(14).max(18)` | ⚠️ Backend fraco |
| **commissionPercentage** | `@Min(0).@Max(100)` | `z.number().min(0).max(100)` | ✅ OK |
| **price** | `@IsNumber().@Min(0)` | Não validado no formulário | ❌ Frontend não valida |

---

## Relacionamentos e Integridade de Dados

### Relacionamentos TypeORM

```typescript
// Company → Customers (OneToMany)
@OneToMany(() => Customer, (customer) => customer.company)
customers: Customer[];

// Customer → Company (ManyToOne)
@ManyToOne(() => Company, (company) => company.customers)
@JoinColumn({ name: 'company_id' })
company: Company;

// Professional → Services (ManyToMany via ProfessionalService)
@OneToMany(() => ProfessionalService, (ps) => ps.professional)
professionalServices: ProfessionalService[];
```

### Problemas Identificados:

1. **Orphan Records:** Possibilidade de orphaned records se a empresa for excluída sem cascade
2. **Soft Delete:** Uso de `@DeleteDateColumn` pode causar inconsistências se não tratado corretamente
3. **Índices Únicos:** Apenas `phone + companyId` tem índice único no Customer

**Correção Sugerida:**
```typescript
@Entity({ name: 'cliente_gdb_companies' })
export class Company {
  // ...
  @OneToMany(() => Customer, (customer) => customer.company, { cascade: true })
  customers: Customer[];
  // ...
}
```

---

## Autenticação e Autorização

### Fluxo de Autenticação

1. **Login:** `POST /auth/login` → Retorna `access_token`
2. **Validação:** `GET /auth/validate` → Verifica token JWT
3. **Proteção:** `@UseGuards(JwtAuthGuard)` em endpoints protegidos

### Problemas Identificados:

1. **Tokens KDS:** O sistema tem lógica separada para tokens KDS que pode causar inconsistências
2. **Company-Id Header:** O header `Company-Id` é usado para filtrar dados, mas pode ser manipulado

**Correção Sugerida:**
```typescript
// No JwtStrategy, garantir que o companyId vem do token e não do header
const payload = {
  sub: String(user.id),
  email: user.email,
  name: user.name,
  role: user.role,
  companyId: user.companyId, // Do token, não do header
};
```

---

## Documentos e Formatos (CNPJ, Telefone)

### Validação de CNPJ

| Aspecto | Status | Observação |
|---------|--------|------------|
| Formato numérico | ⚠️ parcial | Apenas remove não-dígitos no frontend |
| Dígitos verificadores | ❌ ausente | Não valida CNPJ real |
| Máscara | ✅ presente | Frontend usa `00.000.000/0000-00` |
| Limite de caracteres | ✅ presente | Max 18 no frontend |

### Validação de Telefone

| Aspecto | Status | Observação |
|---------|--------|------------|
| Dígitos apenas | ✅ presente | Frontend remove não-dígitos |
| Comprimento | ⚠️ parcial | Frontend valida 10-15 dígitos |
| Formato internacional | ❌ ausente | Não valida prefixo país |
| WhatsApp | ⚠️ parcial | Apenas recomendado, não validado |

### Correções Sugeridas:

**Backend - CNPJ:**
```typescript
// Adicionar validação de dígito verificador
function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return false;
  
  // Validação de dígitos verificadores
  // ...
  return true;
}
```

**Backend - Telefone:**
```typescript
// Adicionar validação de telefone brasileiro
@Matches(/^(\+55|55)?[1-9]\d{9,10}$/, {
  message: 'Telefone deve ser um número brasileiro válido (DDD + número)'
})
phone: string;
```

---

## Recomendações de Correção

### Prioridade ALTA (Corrigir Imediatamente)

1. **Padronizar tipos de ID** - Alterar `string` para `number` no frontend
2. **Validação de CNPJ** - Adicionar validação de formato no backend
3. **Validação de Telefone** - Adicionar validação de formato no backend
4. **Conversão de tipos** - Garantir conversão correta antes de enviar para API

### Prioridade MÉDIA (Corrigir em 1-2 Sprints)

5. **Atualização de totalSpent** - Implementar lógica de atualização automática
6. **Enum de Gender** - Padronizar valores permitidos
7. **Status automático de schedules** - Adicionar cron job para atualizar expirados
8. **Validação de dependências** - Impedir exclusão de registros com vínculos
9. **Tratamento de erros** - Padronizar em todo o frontend

### Prioridade BAIXA (Corrigir quando Possível)

10. **Documentação Swagger** - Completar em todos os endpoints
11. **Remover logs de debug** - Limpar logs sensíveis
12. **Formatação de preços** - Usar utilitários consistentes
13. **Paginação** - Padronizar limites em todos os endpoints

---

## Dependências entre Correções

```
1. Padronizar tipos de ID (ALTA)
   │
   ├── Depende de: Nenhuma
   └── блокуі:
       ├── Conversão de tipos no ScheduleModal
       ├── Conversão de tipos no CustomerModal
       └── Conversão de tipos no ProfessionalModal

2. Validação de CNPJ (ALTA)
   │
   ├── Depende de: Nenhuma
   └── Dependências: Nenhuma

3. Validação de Telefone (ALTA)
   │
   ├── Depende de: Nenhuma
   └── Dependências: Nenhuma

4. Atualização de totalSpent (MÉDIA)
   │
   ├── Depende de: 1 (tipos corretos)
   └── блокуі:
       ├── Atualização no PaymentsService
       └── Atualização no SalesService

5. Enum de Gender (MÉDIA)
   │
   ├── Depende de: Nenhuma
   └── Dependências:
       ├── Alteração na entidade Customer
       └── Migração de dados existente

6. Status automático de schedules (MÉDIA)
   │
   ├── Depende de: Nenhuma
   └── Dependências:
       ├── Configuração do módulo Cron
       └── Testes de integração

7. Validação de dependências (MÉDIA)
   │
   ├── Depende de: 1 (tipos corretos)
   └── Dependências: Nenhuma

8. Tratamento de erros padronizado (MÉDIA)
   │
   ├── Depende de: Nenhuma
   └── Dependências:
       └── Criação de interceptor global

9. Documentação Swagger (BAIXA)
   │
   ├── Depende de: Nenhuma
   └── Dependências: Nenhuma

10. Remover logs de debug (BAIXA)
    │
    ├── Depende de: Nenhuma
    └── Dependências: Nenhuma
```

---

## Plano de Ação Recomendado

### Sprint 1 (Corrigir Incompatibilidades Críticas)

- [ ] Padronizar tipos de ID (number) em `/root/clawd/workspace/clickestilo/app-barbershop/src/types/index.ts`
- [ ] Corrigir conversões de tipos nos modais (Schedule, Customer, Professional)
- [ ] Adicionar validação de CNPJ no backend
- [ ] Adicionar validação de telefone no backend

### Sprint 2 (Melhorias de Integridade)

- [ ] Implementar atualização automática de `totalSpent`
- [ ] Adicionar validação de dependências na exclusão
- [ ] Padronizar enum Gender
- [ ] Adicionar cron job para status de schedules

### Sprint 3 (Melhorias de UX)

- [ ] Padronizar tratamento de erros no frontend
- [ ] Completar documentação Swagger
- [ ] Remover logs de debug sensíveis
- [ ] Unificar formatação de preços

---

## Conclusão

O projeto ClickEstilo apresenta uma estrutura bem organizada com separação clara de responsabilidades entre backend (NestJS) e frontend (Next.js). No entanto, foram identificadas **várias inconsistências de tipos** entre frontend e backend que podem causar problemas em produção.

As correções de **alta prioridade** devem ser implementadas imediatamente para garantir a estabilidade do sistema. As correções de **média e baixa prioridade** podem ser planejadas para sprints futuros conforme a necessidade do negócio.

**Recomendação principal:** Criar tipos compartilhados entre frontend e backend (usando monorepo ou biblioteca compartilhada) para evitar inconsistências de tipos no futuro.
