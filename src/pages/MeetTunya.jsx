export default function MeetTunya({ go }) {
  return (
    <div data-screen-label="Meet Tunya">
          <div style={{background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 100px", display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: "80px", alignItems: "center"}}>
              <div>
                <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Meet Tunya</div>
                <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "76px", lineHeight: "1.05", margin: "18px 0 0", maxWidth: "16ch"}}>The first of its kind on the continent.</h1>
                <p style={{margin: "24px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>Tunya is our conversational travel assistant — built by Tunyafrika so you can plan, book and change an African journey the way you'd talk to a friend who lives there.</p>
                <p style={{margin: "18px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>Bookings, availability, prices, border rules, pickup times, restaurant tables, last-minute additions. No forms. No waiting for office hours.</p>
                <div style={{display: "inline-flex", alignItems: "center", gap: "12px", marginTop: "34px", background: "#b3955c", color: "#04301f", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase"}}>www.tunya.africa</div>
              </div>
              <div style={{display: "grid", gap: "16px"}}>
                <div style={{background: "rgba(250,243,232,0.95)", color: "#0d2b1e", padding: "22px 26px", fontSize: "18px", fontWeight: "300", lineHeight: "1.6", maxWidth: "78%"}}>"Four days in Vic Falls for two — the falls, a safari, and something wild."</div>
                <div style={{background: "#b3955c", color: "#0d2b1e", padding: "22px 26px", fontSize: "18px", fontWeight: "300", lineHeight: "1.6", maxWidth: "88%", justifySelf: "end"}}>"Done. Rainforest tour Tuesday, Chobe day trip Wednesday, sunset cruise Thursday, and a 111 m bungee for the brave one. Shall I hold it all?"</div>
                <div style={{background: "rgba(250,243,232,0.95)", color: "#0d2b1e", padding: "22px 26px", fontSize: "18px", fontWeight: "300", lineHeight: "1.6", maxWidth: "60%"}}>"Do we need a visa for Botswana?"</div>
                <div style={{background: "#b3955c", color: "#0d2b1e", padding: "22px 26px", fontSize: "18px", fontWeight: "300", lineHeight: "1.6", maxWidth: "84%", justifySelf: "end"}}>"Not for your passports — just bring them. Our guide handles the border both ways."</div>
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px"}}>
            <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>Book instantly</div>
              <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>Activities, lodges, transfers and tables — confirmed while you're still chatting.</p>
            </div>
            <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>Ask anything</div>
              <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>Weather, water levels, what to pack, whether the children can raft.</p>
            </div>
            <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>Live updates</div>
              <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>Pickup times, changes, delays — pushed to you before you have to ask.</p>
            </div>
            <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>Humans behind it</div>
              <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>Every booking is checked by our team in Victoria Falls. Tunya is fast; we are accountable.</p>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 110px"}}>
            <div style={{position: "relative"}}>
              <img src="/assets/br-tunya-site.jpg" alt="Tunya on any device" style={{width: "100%", height: "460px", objectFit: "cover", display: "block"}} />
              <div className="deco-frame" style={{position: "absolute", top: "-16px", left: "-16px", right: "16px", bottom: "16px", border: "1px solid #b3955c", pointerEvents: "none"}}></div>
            </div>
            <div className="stack-m" style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", marginTop: "48px"}}>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "46px", lineHeight: "1.12", margin: "0", maxWidth: "22ch"}}>Say hello. Your trip begins in a sentence.</h2>
              <a className="x6" href="https://www.tunya.africa" target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap", textDecoration: "none"}}>Start With Tunya</a>
            </div>
          </div>
        </div>
  );
}
