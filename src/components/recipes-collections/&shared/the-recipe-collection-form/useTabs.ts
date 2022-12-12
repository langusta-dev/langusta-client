enum TabKey {
  PublicRecipes,
  UserRecipes,
  SelectedRecipes,
  Description,
}

const TAB_KEYS = [
  TabKey.PublicRecipes,
  TabKey.UserRecipes,
  TabKey.SelectedRecipes,
  TabKey.Description,
];

export const useTabs = () => {
  const { t } = useI18n();

  let activeTabKey = $ref(TabKey.PublicRecipes);

  const setActiveTabKey = (key: TabKey) => {
    activeTabKey = key;
  };

  const getLocaleByTabKey = (key: TabKey) =>
    ({
      [TabKey.PublicRecipes]: t('recipe_collections.form.tabs.public_recipes'),
      [TabKey.UserRecipes]: t('recipe_collections.form.tabs.user_recipes'),
      [TabKey.SelectedRecipes]: t(
        'recipe_collections.form.tabs.selected_recipes'
      ),
      [TabKey.Description]: t('recipe_collections.form.tabs.description'),
    }[key]);

  return $$({
    TabKey,
    TAB_KEYS,
    activeTabKey,
    setActiveTabKey,
    getLocaleByTabKey,
  });
};
