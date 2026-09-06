/**
 * یه marker interface ساده. سرویس‌های دامنه‌ای (منطقی که به یه Entity/Aggregate
 * خاص تعلق نداره ولی خالص دامنه‌ست، نه application-layer) این رو implement می‌کنن.
 */
export interface DomainService {
  readonly _domainServiceBrand?: never;
}
