export async function extractYoutubeUrl() {
  const urlsId = [
        "Yb5dDiiEcic",
        "ODni_Bey154",
        "Fex-wvrOZf4",
        "S0-ZKIlEYO8",
        "0_Ufbm5ZkBY",
        "7UuUeoyYmxI",
        "7UuUeoyYmxI",
        "X-N5jb-fWTs",
        "Lfj8SKFlTpI",
        "7fVUyVuyP6I",
        "Qyu-fZ8BOnI",
        "29OFyXJC_uA",
        "BlUD-CRhAnA",
        "0ZiD_Lb3Tm0",
        "r-q5V6LDxEY",
        "H--LWj2KpoM",
        "zq7ec6Mo530",
        "cNPEH0GOhRw",
        "zO3jFKiqmHo",
        "G4H1N_yXBiA",
        "UkhaC6Pc0ZM",
        "HsAUGbUgx6Y",
        "qS8XWa9268U",
        "9q29nu2T0Ko",
        "sJLJGeTEhJs",
        "jAa58N4Jlos",
        "jAa58N4Jlos",
    ]

  const randomIndex = Math.floor(Math.random() * urlsId.length);
  return urlsId[randomIndex];
}
