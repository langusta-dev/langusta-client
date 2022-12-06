enum TabKey {
  PublicRecipes,
  UserRecipes,
  Description,
}

const TAB_KEYS = [TabKey.PublicRecipes, TabKey.UserRecipes, TabKey.Description];

export const useTabs = () => {
  const { t } = useI18n();

  let activeTabKey = $ref(TabKey.PublicRecipes);

  const setActiveTabKey = (key: TabKey) => {
    activeTabKey = key;
  };

  const isActiveTabKey = (key: TabKey) => key === activeTabKey;

  const getLocaleByTabKey = (key: TabKey) =>
    ({
      [TabKey.PublicRecipes]: t('recipe_collections.form.tabs.public_recipes'),
      [TabKey.UserRecipes]: t('recipe_collections.form.tabs.user_recipes'),
      [TabKey.Description]: t('recipe_collections.form.tabs.description'),
    }[key]);

  return $$({
    TabKey,
    TAB_KEYS,
    activeTabKey,
    setActiveTabKey,
    isActiveTabKey,
    getLocaleByTabKey,
  });
};