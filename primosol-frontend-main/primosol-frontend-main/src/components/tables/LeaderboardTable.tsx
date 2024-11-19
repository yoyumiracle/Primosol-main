export default function LeaderboardTable() {
  return (
    <div className="leaderboardTable flex flex-col w-full text-sm font-semibold">
      <div className="row text-gray px-4 md:px-6 py-2">
        <div>Ranking</div>
        <div>Wallet</div>
        <div>Total Points</div>
        <div>Week Points</div>
      </div>
      <div className="body flex flex-col gap-1">
        <div className="row px-4 md:px-6 py-2 md:py-4">
          <div className="flex">
            <div className="text-center w-12">1</div>
          </div>
          <div>0x00000</div>
          <div>1243</div>
          <div>123</div>
        </div>
      </div>
    </div>
  );
}
