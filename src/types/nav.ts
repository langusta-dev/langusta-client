import type { LocaleKey } from './i18n';
import type { RouteRecordNormalized } from 'vue-router';

export interface NavigableRoute extends RouteRecordNormalized {
  meta: {
    nav: true;
    navOrder: number;
    navIcon: string;
    title: LocaleKey;
  };
}
