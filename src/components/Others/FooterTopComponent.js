import { useEffect, useState } from "react";
import http from "../../http";
import Loader from "../Loader/Loader";
export const FooterTopComponent = () => {

  const [footerContent, SetfooterContent] = useState({});
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFooterContent = async () => {
          setLoading(true);
            try {
                const getresponse = await http.get("/fetch-home-page");
                SetfooterContent(getresponse.data); 
            } catch (error) {
                console.error("Error fetching footer content data:", error);
            } finally {
              setLoading(false);
            }
        };
  
        fetchFooterContent();
    }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div class="yudfdfgdfbgdfgdffgfg">
        <div class="container-fluid">
          {/* <div class="dfgjhfdg2455f">
            <div class="fgnjhdf">
              <h6>
                There are many variations of passages of Lorem Ipsum available
              </h6>
            </div>

            <div class="dfghdfg654">
              <h6>
                Contrary to popular belief, Lorem Ipsum is not simply random
                text:
              </h6>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the Lorem Ipsum generators on
                the Internet tend to repeat predefined chunks as necessary,
                making this the first true generator on the Internet.
              </p>
            </div>

            <div class="dfghdfg654">
              <h6>Contrary to popular belief, Lorem Ipsum is not simply:</h6>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the Lorem Ipsum generators on
                the Internet tend to repeat predefined chunks as necessary,
                making this the first true generator on the Internet.
              </p>
            </div>

            <div class="dfghdfg654">
              <h6>Contrary to popular belief, Lorem:</h6>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the Lorem Ipsum generators on
                the Internet tend to repeat predefined chunks as necessary,
                making this the first true generator on the Internet.
              </p>
            </div>

            <div class="dfghdfg654">
              <h6>Contrary to popular belief, Lorem Ipsum is not simply:</h6>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the Lorem Ipsum generators on
                the Internet tend to repeat predefined chunks as necessary,
                making this the first true generator on the Internet.
              </p>
            </div>
          </div>

          <div class="dfngjhdfgd5151fg">
            <div class="kdfbhjgdfg65468546">
              <div class="fbgfd">
                <h6>Featured Designers:</h6>
              </div>
              <div class="fbgdfgd">
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Isha Gupta Tayal </a>
                <a href="/">Deepika Arora</a>
                <a href="/">Palak & Mehak</a>
                <a href="/">LABEL SHRISTI CHETANI </a>
                <a href="/">Nirmooha</a>
                <a href="/">Sheetal Batra</a>
                <a href="/">AFFROZ</a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
              </div>
            </div>

            <div class="kdfbhjgdfg65468546">
              <div class="fbgfd">
                <h6>Top Designers for Wedding :</h6>
              </div>
              <div class="fbgdfgd">
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Isha Gupta Tayal </a>
                <a href="/">Deepika Arora</a>
                <a href="/">Palak & Mehak</a>
                <a href="/">LABEL SHRISTI CHETANI </a>
                <a href="/">Nirmooha</a>
                <a href="/">Sheetal Batra</a>
                <a href="/">AFFROZ</a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
              </div>
            </div>

            <div class="kdfbhjgdfg65468546">
              <div class="fbgfd">
                <h6>Celebrity Styles:</h6>
              </div>
              <div class="fbgdfgd">
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Isha Gupta Tayal </a>
                <a href="/">Deepika Arora</a>
                <a href="/">Palak & Mehak</a>
                <a href="/">LABEL SHRISTI CHETANI </a>
                <a href="/">Nirmooha</a>
                <a href="/">Sheetal Batra</a>
                <a href="/">AFFROZ</a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
              </div>
            </div>

            <div class="kdfbhjgdfg65468546">
              <div class="fbgfd">
                <h6>Shop By Occasions:</h6>
              </div>
              <div class="fbgdfgd">
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Isha Gupta Tayal </a>
                <a href="/">Deepika Arora</a>
                <a href="/">Palak & Mehak</a>
                <a href="/">LABEL SHRISTI CHETANI </a>
                <a href="/">Nirmooha</a>
                <a href="/">Sheetal Batra</a>
                <a href="/">AFFROZ</a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
              </div>
            </div>

            <div class="kdfbhjgdfg65468546">
              <div class="fbgfd">
                <h6>Aza Magazine:</h6>
              </div>
              <div class="fbgdfgd">
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Isha Gupta Tayal </a>
                <a href="/">Deepika Arora</a>
                <a href="/">Palak & Mehak</a>
                <a href="/">LABEL SHRISTI CHETANI </a>
                <a href="/">Nirmooha</a>
                <a href="/">Sheetal Batra</a>
                <a href="/">AFFROZ</a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
                <a href="/">Fayon Kids </a>
                <a href="/">POMCHA JAIPUR</a>
                <a href="/">Masaba</a>
                <a href="/">Gulabo Jaipur</a>
                <a href="/">Chotibuti</a>
                <a href="/">Paulmi and Harsh</a>
                <a href="/">Basanti - Kapde Aur Koffee </a>
                <a href="/">LASHKARAA</a>
                <a href="/">Sabyasachi </a>
                <a href="/">Kasbah</a>
                <a href="/">Aryavir Malhotra </a>
                <a href="/">Samyukta Singhania</a>
                <a href="/">KARAJ JAIPUR</a>
                <a href="/">Aariyana Couture</a>
              </div>
            </div>
          </div> */}
          <div
            className="pt-4"
            dangerouslySetInnerHTML={{
              __html: footerContent?.data?.description
            }}
          />
        </div>
      </div>
    </div>
  );
};
