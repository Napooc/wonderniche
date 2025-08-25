
-- 1) STORAGE POLICIES FOR product-images BUCKET

-- Public read (works for both anon and authenticated)
drop policy if exists "Public read for product-images" on storage.objects;
create policy "Public read for product-images"
on storage.objects
for select
using (bucket_id = 'product-images');

-- Admins can upload (INSERT) to product-images
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can update (e.g., replace) images
drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can delete images
drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and has_role(auth.uid(), 'admin'::app_role)
);

-- 2) PRODUCTS TRIGGER: set created_by and keep updated_at fresh

create or replace function public.set_products_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.created_by is null then
      new.created_by := auth.uid();
    end if;
    new.updated_at := now();
  elsif tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists set_products_defaults on public.products;
create trigger set_products_defaults
before insert or update on public.products
for each row
execute function public.set_products_defaults();
