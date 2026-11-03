create table public.transacoes (
  id bigint generated always as identity primary key,
  nome text not null,
  descricao text not null,
  valor numeric not null default 0,
  id_categoria integer not null,
  data text not null,
  criado_em timestamptz not null default now()
);

alter table public.transacoes
enable row level security;

create policy "leitura anonima"
on public.transacoes
for select
to anon
using (true);

create policy "inclusao anonima"
on public.transacoes
for insert
to anon
with check (true);

grant usage on schema public to anon;

grant select, insert
on public.transacoes
to anon;

grant usage, select
on sequence public.transacoes_id_seq
to anon;

revoke update, delete
on public.transacoes
from anon;