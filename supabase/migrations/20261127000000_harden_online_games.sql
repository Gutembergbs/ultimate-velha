create or replace function public.select_game_side(
  p_game_id text,
  p_side text,
  p_local_id text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_players jsonb;
  updated_players jsonb;
begin
  if p_side not in ('X', 'O') then
    return jsonb_build_object('ok', false, 'error', 'Lado invalido');
  end if;

  select players into current_players
  from public.games
  where id = p_game_id
  for update;

  if current_players is null then
    return jsonb_build_object('ok', false, 'error', 'Sala nao encontrada');
  end if;

  if coalesce(current_players ->> p_side, '') <> '' then
    return jsonb_build_object('ok', false, 'error', 'Lado ocupado');
  end if;

  updated_players := current_players || jsonb_build_object(p_side, p_local_id);

  update public.games
  set players = updated_players
  where id = p_game_id
    and coalesce(players ->> p_side, '') = '';

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Lado ocupado');
  end if;

  return jsonb_build_object('ok', true, 'players', updated_players);
end;
$$;

create or replace function public.submit_game_move(
  p_game_id text,
  p_local_id text,
  p_expected_player text,
  p_board jsonb,
  p_winners jsonb,
  p_next_player text,
  p_active_board integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  players_value jsonb;
begin
  if p_expected_player not in ('X', 'O') or p_next_player not in ('X', 'O') then
    return false;
  end if;

  select players into players_value
  from public.games
  where id = p_game_id
  for update;

  if players_value is null
     or coalesce(players_value ->> p_expected_player, '') <> p_local_id then
    return false;
  end if;

  update public.games
  set board = p_board,
      winners = p_winners,
      current_player = p_next_player,
      active_board = p_active_board
  where id = p_game_id
    and current_player = p_expected_player;

  return found;
end;
$$;

create or replace function public.reset_online_game(
  p_game_id text,
  p_winner text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  next_score_x integer;
  next_score_o integer;
begin
  select
    score_x + case when p_winner = 'X' then 1 else 0 end,
    score_o + case when p_winner = 'O' then 1 else 0 end
  into next_score_x, next_score_o
  from public.games
  where id = p_game_id
  for update;

  if not found then
    return false;
  end if;

  update public.games
  set board = jsonb_build_array(
        jsonb_build_array(null,null,null,null,null,null,null,null,null),
        jsonb_build_array(null,null,null,null,null,null,null,null,null),
        jsonb_build_array(null,null,null,null,null,null,null,null,null),
        jsonb_build_array(null,null,null,null,null,null,null,null,null),
        jsonb_build_array(null,null,null,null,null,null,null,null,null),
        jsonb_build_array(null,null,null,null,null,null,null,null,null),
        jsonb_build_array(null,null,null,null,null,null,null,null,null),
        jsonb_build_array(null,null,null,null,null,null,null,null,null),
        jsonb_build_array(null,null,null,null,null,null,null,null,null)
      ),
      winners = jsonb_build_array(null,null,null,null,null,null,null,null,null),
      current_player = 'X',
      active_board = null,
      score_x = next_score_x,
      score_o = next_score_o
  where id = p_game_id;

  return true;
end;
$$;

grant execute on function public.select_game_side(text, text, text) to anon, authenticated;
grant execute on function public.submit_game_move(text, text, text, jsonb, jsonb, text, integer) to anon, authenticated;
grant execute on function public.reset_online_game(text, text) to anon, authenticated;
