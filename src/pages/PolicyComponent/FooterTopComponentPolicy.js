
export const FooterTopComponentPolicy = ({PolicyDetails}) => {
  return (
    <div> 
      <div class="yudfdfgdfbgdfgdffgfg">
        <div class="container-fluid">
          <div
            className="pt-4"
            dangerouslySetInnerHTML={{
              __html: PolicyDetails.data?.last_description
            }}
          />
        </div>
      </div>
    </div>
  );
};