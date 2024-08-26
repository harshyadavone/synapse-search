const ResultsInfo: React.FC<{ searchInfo: any }> = ({ searchInfo }) => (
  <div className="w-full p-4 md:ml-52 max-w-3xl  mb-6  bg-accent/10 rounded-lg">
    <p className="text-sm text-muted-foreground">
      About{" "}
      <span className="font-semibold">{searchInfo.formattedTotalResults}</span>{" "}
      results (
      <span className="font-semibold">{searchInfo.formattedSearchTime}</span>{" "}
      seconds)
    </p>
  </div>
);
export default ResultsInfo;
