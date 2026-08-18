export default function About({ go }) {
  return (
    <div data-screen-label="About Tunyafrika">
          <div style={{position: "relative", height: "62vh", minHeight: "480px", background: "#04301f", overflow: "hidden"}}>
            <img src="/assets/br-promise-crew.jpg" alt="The people behind Tunyafrika" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.5) 0%, rgba(4,48,31,0.12) 40%, rgba(4,48,31,0.92) 85%, rgba(4,48,31,0.98) 100%)"}}></div>
            <div style={{position: "absolute", left: "0", right: "0", bottom: "68px", maxWidth: "1400px", margin: "0 auto", padding: "0 48px"}}>
              <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>About Tunyafrika</div>
              <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "74px", lineHeight: "1.05", color: "#faf3e8", margin: "16px 0 0", maxWidth: "18ch"}}>We are the people who live beside the thunder.</h1>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "80px"}}>
            <div>
              <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Who we are</div>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "46px", lineHeight: "1.1", margin: "16px 0 0"}}>A Victoria Falls company, built by Victoria Falls people.</h2>
            </div>
            <div>
              <p style={{margin: "0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9"}}>Tunyafrika Xperiences was founded on a simple frustration: the world's most extraordinary waterfall was being sold to visitors by people who had never stood in its spray. We thought the story deserved to be told by the people who grew up in it.</p>
              <p style={{margin: "20px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9"}}>Today we plan, book and personally look after journeys that begin at Mosi-oa-Tunya and reach across the continent — and we built Tunya, Africa's first conversational travel assistant, so that anyone, anywhere, can reach us in a sentence.</p>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0"}}>
            <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Our mandate</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "34px", marginTop: "30px"}}>
              <div style={{borderTop: "1px solid #b3955c", paddingTop: "18px"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px"}}>Make it effortless</div>
                <p style={{margin: "10px 0 0", fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(13,43,30,0.78)"}}>One conversation should be enough to plan a whole journey — borders, bookings, transfers and tables handled before you land.</p>
              </div>
              <div style={{borderTop: "1px solid #b3955c", paddingTop: "18px"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px"}}>Keep it ours</div>
                <p style={{margin: "10px 0 0", fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(13,43,30,0.78)"}}>Local guides, local lodges, local suppliers. What our visitors spend should stay in the town that hosts them.</p>
              </div>
              <div style={{borderTop: "1px solid #b3955c", paddingTop: "18px"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px"}}>Tell it truthfully</div>
                <p style={{margin: "10px 0 0", fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(13,43,30,0.78)"}}>No inflated promises, no hidden extras. If the water is low, we say so — and show you what is spectacular instead.</p>
              </div>
            </div>
          </div>
    
          <div style={{marginTop: "100px", background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "70px"}}>
              <div>
                <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>What we believe</div>
                <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "50px", lineHeight: "1.08", margin: "16px 0 0"}}>Travel should leave two things better: you, and the place you visited.</h2>
              </div>
              <div style={{display: "grid", gap: "22px", alignContent: "center"}}>
                <div style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px", fontWeight: "300", fontSize: "18px", lineHeight: "1.8", color: "rgba(250,243,232,0.9)"}}>That a guide's story is worth more than a brochure's adjective.</div>
                <div style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px", fontWeight: "300", fontSize: "18px", lineHeight: "1.8", color: "rgba(250,243,232,0.9)"}}>That technology should remove friction, never remove people.</div>
                <div style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px", fontWeight: "300", fontSize: "18px", lineHeight: "1.8", color: "rgba(250,243,232,0.9)"}}>That hospitality is a Zimbabwean inheritance, not a service standard.</div>
                <div style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px", fontWeight: "300", fontSize: "18px", lineHeight: "1.8", color: "rgba(250,243,232,0.9)"}}>That the wild is a guest we are hosting, not a product we are selling.</div>
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 0"}}>
            <div className="stack-m" style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "40px"}}>
              <div>
                <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>The faces behind Tunya</div>
                <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "50px", lineHeight: "1.1", margin: "16px 0 0"}}>The team</h2>
              </div>
              <div style={{fontSize: "13px", fontWeight: "300", color: "rgba(13,43,30,0.6)", maxWidth: "34ch", textAlign: "right"}}>Portraits are placeholders — send us the real photographs and we'll drop them in.</div>
            </div>
            <div className="team-grid" style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", marginTop: "44px"}}>
              <div>
                <div style={{height: "320px", background: "linear-gradient(160deg, #0b3d28 0%, #04301f 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(179,149,92,0.45)"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "58px", color: "#b3955c"}}>TM</div>
                </div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", marginTop: "16px", lineHeight: "1.25"}}>Theophilus Munashe Maposa</div>
                <div style={{fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b3955c", marginTop: "6px"}}>Operations</div>
              </div>
              <div>
                <div style={{height: "320px", background: "linear-gradient(160deg, #0b3d28 0%, #04301f 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(179,149,92,0.45)"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "58px", color: "#b3955c"}}>RV</div>
                </div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", marginTop: "16px", lineHeight: "1.25"}}>Rudolph Benjamin Volksgyn</div>
                <div style={{fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b3955c", marginTop: "6px"}}>Operations</div>
              </div>
              <div>
                <div style={{height: "320px", background: "linear-gradient(160deg, #0b3d28 0%, #04301f 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(179,149,92,0.45)"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "58px", color: "#b3955c"}}>DM</div>
                </div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", marginTop: "16px", lineHeight: "1.25"}}>Dzikamai Ronald Muchemedzi</div>
                <div style={{fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b3955c", marginTop: "6px"}}>Operations</div>
              </div>
              <div>
                <div style={{height: "320px", background: "linear-gradient(160deg, #0b3d28 0%, #04301f 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(179,149,92,0.45)"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "58px", color: "#b3955c"}}>TC</div>
                </div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", marginTop: "16px", lineHeight: "1.25"}}>Tatenda Blessing Chakwesha</div>
                <div style={{fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b3955c", marginTop: "6px"}}>Operations</div>
              </div>
              <div>
                <div style={{height: "320px", background: "linear-gradient(160deg, #0b3d28 0%, #04301f 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(179,149,92,0.45)"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "58px", color: "#b3955c"}}>F</div>
                </div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", marginTop: "16px", lineHeight: "1.25"}}>Fungai</div>
                <div style={{fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b3955c", marginTop: "6px"}}>Operations</div>
              </div>
            </div>
          </div>
    
          <div className="stack-m" style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 110px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px"}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "46px", lineHeight: "1.12", margin: "0", maxWidth: "22ch"}}>Come and meet us where the spray begins.</h2>
            <a className="x6" href="https://www.tunya.africa" target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap", textDecoration: "none"}}>Plan My Trip</a>
          </div>
        </div>
  );
}
