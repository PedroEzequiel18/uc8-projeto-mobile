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

-- Edição e exclusão de transações (telas Editar e Excluir).
-- Decisão consciente: o guia do módulo 8 sugere 'revoke update, delete ... from anon'
-- para que a API recuse alterar e apagar (42501). Este app precisa do CRUD completo,
-- então o papel anon mantém update e delete, com policies explícitas.
-- Limitação conhecida: sem login, qualquer pessoa com a chave publicável pode alterar
-- ou apagar linhas. A correção futura é exigir autenticação (Supabase Auth) e trocar
-- 'to anon using (true)' por 'to authenticated using (auth.uid() = dono)'.
drop policy if exists "alteracao anonima" on public.transacoes;

create policy "alteracao anonima"
on public.transacoes
for update
to anon
using (true)
with check (true);

drop policy if exists "exclusao anonima" on public.transacoes;

create policy "exclusao anonima"
on public.transacoes
for delete
to anon
using (true);

grant update, delete
on public.transacoes
to anon;
