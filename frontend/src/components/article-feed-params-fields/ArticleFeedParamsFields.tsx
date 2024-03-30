import { DatePicker, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useFeed } from "../../api/useFeed";
import { ArticleFeedParams } from "../../types/article";

export type ArticleFeedParamsProps = {
  params: ArticleFeedParams;
  onParamsChange: (filter: ArticleFeedParams) => void;
};

export const ArticleFeedParamsFields = ({
  params,
  onParamsChange,
}: ArticleFeedParamsProps) => {
  const { useGetAvailableFeedLanguages } = useFeed();

  const { data, isLoading } = useGetAvailableFeedLanguages();

  const languageOptions = useMemo(() => {
    return (
      data?.map((language) => ({
        key: language.id,
        value: language.code,
        label: language.name,
      })) ?? []
    );
  }, [data]);

  const handleDateChange = (_date: Dayjs, dateString: string | string[]) => {
    onParamsChange({ ...params, date: dateString as string });
  };

  const handleLanguageChange = (languageCode: string) => {
    onParamsChange({ ...params, languageCode });
  };

  return (
    <div className="article-feed-params-fields">
      <div className="article-feed-params-fields-date">
        <div className="article-feed-params-fields-date-label">Date:</div>
        <DatePicker
          className="article-feed-params-fields-date-picker"
          defaultValue={dayjs(params.date)}
          onChange={handleDateChange}
          disabledDate={(date) => {
            return date.isAfter(dayjs());
          }}
        />
      </div>
      <div className="article-feed-params-fields-language">
        <div className="article-feed-params-fields-language-label">
          Language:
        </div>
        <Select
          className="article-feed-params-fields-language-select"
          defaultValue={params.languageCode}
          options={languageOptions}
          onChange={handleLanguageChange}
          loading={isLoading}
        />
      </div>
    </div>
  );
};
